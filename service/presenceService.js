const redis = require("../db/redis");

// ✅ Get count of currently active users
const getActiveUsersCount = async () => {
  try {
    const keys = await redis.keys("presence:*");
    return keys.length;
  } catch (error) {
    console.error("Redis active user count error:", error.message);
    return 0;
  }
};

// ✅ (optional) Get all active user IDs
const getActiveUserIds = async () => {
  try {
    const keys = await redis.keys("presence:*");
    return keys.map((k) => k.split(":")[1]);
  } catch (error) {
    console.error("Redis active user IDs error:", error.message);
    return [];
  }
};

module.exports = { getActiveUsersCount, getActiveUserIds };
