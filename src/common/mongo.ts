import mongoose from 'mongoose';
import dotenv from 'dotenv'
import Logger from './logger';
import { getEnvOrThrow } from './util';

dotenv.config();

const logger = new Logger("mongo");

const connectionOptions = {
  dbName: getEnvOrThrow("DATABASE_NAME") as string,
  maxPoolSize: 10,
  minPoolSize: 5,
  socketTimeoutMS: 45000,
  connectTimeoutMS: 10000,
  serverSelectionTimeoutMS: 10000,
  heartbeatFrequencyMS: 10000,
  retryWrites: true,
  retryReads: true,
  wtimeoutMS: 2500,
  maxIdleTimeMS: 60000
} as mongoose.ConnectOptions;

export const MongoDB = async () => {
  mongoose.set("strictQuery", false);
  
  try {
    const Connection = await mongoose.connect(getEnvOrThrow("MONGO_DB_URL") as string, connectionOptions);

    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB connection error', { error: err.message });
    });

    mongoose.connection.on('disconnected', () => {
      logger.error('MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      logger.info('MongoDB reconnected');
    });

    logger.info('MongoDB connected successfully', { 
      db: Connection.connections[0].name,
      poolSize: connectionOptions.maxPoolSize
    });

    return Connection;
  } catch (err: unknown) {
    const error = err as Error;
    logger.error('Database connection failed', { 
      error: error.message,
      stack: error.stack
    });
    throw error;
  }
}