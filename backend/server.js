// backend/server.js
import path from "path";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import open from "open";

import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import userRoutes from "./routes/user.routes.js";
import connectToMongoDB from "./db/connectToMongoDB.js";
import { app as socketApp, server as socketServer } from "./socket/socket.js";

dotenv.config(); // load .env first

const __dirname = path.resolve();
const PORT = process.env.PORT || 5000;

// Middleware
socketApp.use(express.json());
socketApp.use(cookieParser());
socketApp.use("/api/auth", authRoutes);
socketApp.use("/api/messages", messageRoutes);
socketApp.use("/api/users", userRoutes);

// Serve frontend
socketApp.use(express.static(path.join(__dirname, "../frontend/dist")));
socketApp.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

// Connect to MongoDB and start server
const startServer = async () => {
  await connectToMongoDB();

  socketServer.listen(PORT, () => {
    console.log(`🚀 Server Running on http://localhost:${PORT}`);
    // Open browser automatically
    open(`http://localhost:${PORT}`);
  });
};

startServer();
