import { createClient, RedisClientType } from "redis";
import dotenv from 'dotenv'
import Logger from './logger';
import { getEnvOrThrow } from "./util";

dotenv.config();

const logger = new Logger("redis");

let redisClient: RedisClientType = createClient({
  url: getEnvOrThrow('REDIS_URL')
});

export const Redis = async () => {
  redisClient.on("error", (error: Error) => {
    logger.error("Redis error", { error: error.message });
  });

  if (!redisClient.isOpen) {
    try {
      await redisClient.connect();
      logger.info("Redis connected successfully.");
    } catch (error) {
      logger.error("Failed to connect Redis.", error);
      throw error;
    }
  } else {
    logger.info("Redis is already connected.");
  }
}

export default redisClient;