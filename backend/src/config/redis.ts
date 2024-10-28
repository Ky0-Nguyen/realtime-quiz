import Redis from "ioredis";

const redisClient = new Redis();
const redisSubscriber = new Redis();

export { redisClient, redisSubscriber };
