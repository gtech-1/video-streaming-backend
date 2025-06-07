import mongoose from 'mongoose';
import { config } from './config';

export async function connectDatabase(): Promise<void> {
  try {
    await mongoose.connect(config.mongoDbConnection as string, {
    });
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1); // bail out
  }
}
