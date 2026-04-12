import Product from '../models/Product.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const buildProductQuery = (query) => {
  const filters = {};

  if (query.color) {
    filters.color = query.color;
  }

  if (query.fabric) {
    filters.fabric = query.fabric;
  }

  if (query.category) {
    filters.category = query.category;
  }

  if (query.minPrice || query.maxPrice) {
    filters.price = {};

    if (query.minPrice) {
      filters.price.$gte = Number(query.minPrice);
    }

    if (query.maxPrice) {
      filters.price.$lte = Number(query.maxPrice);
    }
  }

  if (query.search) {
    filters.name = { $regex: query.search, $options: 'i' };
  }

  return filters;
};

export const getProducts = asyncHandler(async (req, res) => {
  const filters = buildProductQuery(req.query);
  const sortDirection = req.query.sort === 'oldest' ? 1 : -1;

  const products = await Product.find(filters).sort({ createdAt: sortDirection });
  res.json(products);
});

export const getFeaturedProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ featured: true }).sort({ createdAt: -1 }).limit(6);
  res.json(products);
});

export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found.');
  }

  res.json(product);
});
