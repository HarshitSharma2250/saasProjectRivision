const redis = require("../db/redis");
const User = require("../models/useLogin.model"); // optional: for DB lastActive update

const HEARTBEAT_EXPIRY = 30; // 30 seconds

async function setupPresence(io) {
  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;

    // 1️⃣ Mark user as online in Redis
    if (userId) {
      redis.set(`presence:${userId}`, "online", { EX: HEARTBEAT_EXPIRY });
    }

    // 2️⃣ Listen for heartbeat events from frontend
    socket.on("heartbeat", async ({ userId }) => {
      await redis.set(`presence:${userId}`, "online", { EX: HEARTBEAT_EXPIRY });
    });

    // 3️⃣ Handle user disconnect
    socket.on("disconnect", async () => {
      console.log(` User disconnected: ${userId}`);
      // Optional: update lastActive in DB
      try {
        if (userId) {
          await User.findByIdAndUpdate(userId, { lastActiveAt: new Date() });
        }
      } catch (error) {
        console.error("DB update error:", error.message);
      }

      // Let Redis expire automatically (no manual delete)
    });
  });
}

module.exports = setupPresence;
