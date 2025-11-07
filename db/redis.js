// db/redis.js
const { createClient } = require("redis");

// ✅ Create a Redis client instance
const redisClient = createClient({
  url: "redis://localhost:6379",
});

// ✅ Add listeners
redisClient.on("connect", () => console.log("✅ Redis connected successfully"));
redisClient.on("ready", () => console.log("🚀 Redis is ready to use"));
redisClient.on("error", (err) => console.error("❌ Redis error:", err));
redisClient.on("end", () => console.log("🔌 Redis connection closed"));

// ✅ Connect once (only when imported)
(async () => {
  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
    }
  } catch (err) {
    console.error("Redis connection failed:", err.message);
  }
})();

// ✅ Export instance so it can be used anywhere
module.exports = redisClient;

