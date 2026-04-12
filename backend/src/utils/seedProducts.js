import Product from '../models/Product.js';
import { sampleProducts } from '../data/products.js';

export const ensureSampleProducts = async () => {
  const count = await Product.countDocuments();

  if (count === 0) {
    await Product.insertMany(sampleProducts);
    console.log('Sample products inserted.');
  }
};
