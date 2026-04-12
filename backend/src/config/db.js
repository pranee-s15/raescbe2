import mongoose from 'mongoose';

export const connectDb = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/raes-boutique';
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000
    });
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    console.error('Make sure MongoDB is running on mongodb://127.0.0.1:27017/raes-boutique or update backend/.env.');
    process.exit(1);
  }
};
