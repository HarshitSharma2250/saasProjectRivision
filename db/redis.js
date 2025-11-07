// db/redis.js
const { createClient } = require("redis");
require("dotenv").config()


const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://red-d46svpogjchc73en03p0:6379",
});


redisClient.on("connect", () => console.log("✅ Redis connected successfully"));
redisClient.on("ready", () => console.log("🚀 Redis is ready to use"));
redisClient.on("error", (err) => console.error("Redis error:", err));
redisClient.on("end", () => console.log("🔌 Redis connection closed"));


(async () => {
  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
    }
  } catch (err) {
    console.error("Redis connection failed:", err.message);
  }
})();

module.exports = redisClient;

