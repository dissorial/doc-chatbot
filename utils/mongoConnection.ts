import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

interface Connection {
  isConnected?: number;
}

const connection: Connection = {};

async function connectDB() {
  if (connection.isConnected) {
    return mongoose.connection;
  }
  const db = await mongoose.connect(MONGODB_URI as string);
  connection.isConnected = db.connections[0].readyState;
  return mongoose.connection;
}

export default connectDB;
