import { Redis } from "ioredis";

const redis = new Redis({
  host: "127.0.0.1", // Redis is running locally on WSL
  port: 6379,
});

redis.on("connect", () => {
  console.log("Redis connected");
});

redis.on("ready", () => {
  console.log("Redis is ready");
});

redis.on("error", (err) => {
  console.error("Redis error:", err);
});

export const appendMessage = async (key, messageData) => {
  await redis.rpush(key, JSON.stringify(messageData));
};

export default redis;
