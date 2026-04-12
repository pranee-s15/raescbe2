import { parse } from 'csv-parse/sync';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getDashboardStats = asyncHandler(async (req, res) => {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const startOfTomorrow = new Date(startOfToday);
  startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);

  const startOfYesterday = new Date(startOfToday);
  startOfYesterday.setDate(startOfYesterday.getDate() - 1);

  const [usersCount, ordersCount, productsCount, revenueAgg, recentOrders, todayAgg, yesterdayAgg] = await Promise.all([
    User.countDocuments(),
    Order.countDocuments(),
    Product.countDocuments(),
    Order.aggregate([{ $group: { _id: null, revenue: { $sum: '$totalAmount' } } }]),
    Order.find().sort({ createdAt: -1 }).limit(5).populate('user', 'name'),
    Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startOfToday,
            $lt: startOfTomorrow
          }
        }
      },
      { $group: { _id: null, revenue: { $sum: '$totalAmount' } } }
    ]),
    Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startOfYesterday,
            $lt: startOfToday
          }
        }
      },
      { $group: { _id: null, revenue: { $sum: '$totalAmount' } } }
    ])
  ]);

  const revenue = revenueAgg[0]?.revenue || 0;
  const todayRevenue = todayAgg[0]?.revenue || 0;
  const yesterdayRevenue = yesterdayAgg[0]?.revenue || 0;

  res.json({
    totals: {
      users: usersCount,
      orders: ordersCount,
      products: productsCount,
      revenue,
      todayRevenue,
      yesterdayRevenue
    },
    recentOrders
  });
});

export const getAnalytics = asyncHandler(async (req, res) => {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const startOfTomorrow = new Date(startOfToday);
  startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);

  const startOfYesterday = new Date(startOfToday);
  startOfYesterday.setDate(startOfYesterday.getDate() - 1);

  const monthlyRevenue = await Order.aggregate([
    {
      $group: {
        _id: { month: { $month: '$createdAt' } },
        revenue: { $sum: '$totalAmount' },
        orders: { $sum: 1 }
      }
    },
    { $sort: { '_id.month': 1 } }
  ]);

  const topProducts = await Order.aggregate([
    { $unwind: '$items' },
    {
      $group: {
        _id: '$items.name',
        quantitySold: { $sum: '$items.quantity' },
        revenue: { $sum: { $multiply: ['$items.quantity', '$items.price'] } }
      }
    },
    { $sort: { quantitySold: -1 } },
    { $limit: 5 }
  ]);

  const [todayRevenueAgg, yesterdayRevenueAgg] = await Promise.all([
    Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startOfToday,
            $lt: startOfTomorrow
          }
        }
      },
      { $group: { _id: null, revenue: { $sum: '$totalAmount' }, orders: { $sum: 1 } } }
    ]),
    Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startOfYesterday,
            $lt: startOfToday
          }
        }
      },
      { $group: { _id: null, revenue: { $sum: '$totalAmount' }, orders: { $sum: 1 } } }
    ])
  ]);

  res.json({
    monthlyRevenue,
    topProducts,
    dailyRevenue: {
      today: {
        revenue: todayRevenueAgg[0]?.revenue || 0,
        orders: todayRevenueAgg[0]?.orders || 0
      },
      yesterday: {
        revenue: yesterdayRevenueAgg[0]?.revenue || 0,
        orders: yesterdayRevenueAgg[0]?.orders || 0
      }
    }
  });
});

export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password').sort({ createdAt: -1 });
  res.json(users);
});

export const getAllProducts = asyncHandler(async (req, res) => {
  const products = await Product.find().sort({ createdAt: -1 });
  res.json(products);
});

export const createProduct = asyncHandler(async (req, res) => {
  const { name, price, description, fabric, category, color, badge, featured, stock } = req.body;
  const fileName = req.file?.originalname || '';

  const product = await Product.create({
    name,
    price: Number(price),
    description,
    fabric,
    category,
    color,
    badge,
    featured: featured === 'true' || featured === true,
    stock: Number(stock || 0),
    image: fileName,
    imagePlaceholder: fileName ? `Uploaded placeholder: ${fileName}` : 'Luxury Placeholder'
  });

  res.status(201).json(product);
});

export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found.');
  }

  const fields = ['name', 'price', 'description', 'fabric', 'category', 'color', 'badge', 'stock'];
  fields.forEach((field) => {
    if (req.body[field] !== undefined) {
      product[field] = ['price', 'stock'].includes(field) ? Number(req.body[field]) : req.body[field];
    }
  });

  if (req.body.featured !== undefined) {
    product.featured = req.body.featured === 'true' || req.body.featured === true;
  }

  if (req.file?.originalname) {
    product.image = req.file.originalname;
    product.imagePlaceholder = `Uploaded placeholder: ${req.file.originalname}`;
  }

  await product.save();
  res.json(product);
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found.');
  }

  await product.deleteOne();
  res.json({ message: 'Product deleted successfully.' });
});

export const bulkUploadProducts = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('CSV file is required.');
  }

  const csvContent = req.file.buffer.toString('utf-8');
  const records = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true
  });

  const productsToInsert = records.map((record) => ({
    name: record.name,
    price: Number(record.price),
    description: record.description,
    fabric: record.fabric,
    category: record.category,
    color: record.color,
    badge: record.badge || '',
    featured: record.featured === 'true',
    stock: Number(record.stock || 0),
    image: '',
    imagePlaceholder: 'Bulk Upload Placeholder'
  }));

  const inserted = await Product.insertMany(productsToInsert);
  res.status(201).json({
    message: `${inserted.length} products uploaded successfully.`,
    products: inserted
  });
});

export const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 });
  res.json(orders);
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found.');
  }

  order.status = status;
  await order.save();
  res.json(order);
});
