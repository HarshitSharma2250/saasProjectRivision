const express = require("express");
const http = require("http"); // <-- ✅ Needed for socket.io
const ConnectDB = require("./db/config");
const userRouter = require("./routes/user.routes");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const setupPresence = require("./socket/setupPresence");
const { Server } = require("socket.io");

// port
const PORT = process.env.PORT || 4500;

const app = express(); // rename 'server' to 'app' for clarity

// ✅ Create an HTTP server from Express app
const server = http.createServer(app);

// ✅ Setup Socket.IO on top of HTTP server
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000" || "https://saasadmindashboard.netlify.app/login",
    credentials: true,
  },
});

// ✅ Apply presence setup (Socket logic)
setupPresence(io);

// middleware
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", userRouter);

// home route
app.get("/", async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      msg: "welcome to home page",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "something went wrong",
    });
  }
});

// server listening
server.listen(PORT, async () => {
  try {
    await ConnectDB();
    console.log(`Server listening at port: ${PORT}`);
  } catch (error) {
    console.error(" DB connection failed:", error.message);
  }
});
