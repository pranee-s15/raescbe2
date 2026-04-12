import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const createOrder = asyncHandler(async (req, res) => {
  const { items, shippingAddress, paymentMethod } = req.body;

  if (!items || items.length === 0) {
    res.status(400);
    throw new Error('Order must contain at least one item.');
  }

  const normalizedItems = await Promise.all(
    items.map(async (item) => {
      const product = await Product.findById(item.productId);

      if (!product) {
        throw new Error(`Product not found for item ${item.productId}`);
      }

      return {
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: Number(item.quantity || 1),
        image: product.image
      };
    })
  );

  const subtotal = normalizedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingFee = subtotal > 8000 ? 0 : 250;
  const taxAmount = Number((subtotal * 0.05).toFixed(2));
  const totalAmount = subtotal + shippingFee + taxAmount;

  const order = await Order.create({
    user: req.user._id,
    items: normalizedItems,
    shippingAddress,
    paymentMethod,
    subtotal,
    shippingFee,
    taxAmount,
    totalAmount
  });

  res.status(201).json({
    message: 'Order placed successfully.',
    order
  });
});

export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
});

export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');

  if (!order) {
    res.status(404);
    throw new Error('Order not found.');
  }

  if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('You do not have access to this order.');
  }

  res.json(order);
});
