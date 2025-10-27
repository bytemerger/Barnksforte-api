import redis from "./redis";

export default class Cache {
  async get(key: string) {
    const cache = await redis.GET(key);
    
    if(cache) { return JSON.parse(cache) }
    return null;
  }

  async set(key: string, value: any, expiryMinute?: number) {
    if(typeof value !== "object") return;

    if(expiryMinute) {
      await redis.SET(key, JSON.stringify(value), { EX: expiryMinute * 60 });
    } else {
      await redis.SET(key, JSON.stringify(value));
    }
  }

  async delete(key: string) {
    await redis.DEL(key);
  }
}