import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI as string;
let client: MongoClient | null = null;

export async function connectToDatabase() {
  if (!client) {
    try {
      client = new MongoClient(uri);
      await client.connect();
      console.log('MongoDB connected');  // Add this log
    } catch (error) {
      console.error("MongoDB connection error:", error); // Log detailed errors
      throw new Error("Failed to connect to MongoDB");
    }
  }
  return client.db('calhacksdb');
}