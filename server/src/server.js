import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv'
import {server, app} from "./utils/socket.js"
import connectDB from './utils/db.js';
import cookieParser from 'cookie-parser';
import morgan from "morgan";
import path from 'path';


import authRoutes from './routes/auth.route.js';
import userRoutes from './routes/user.route.js';
import messageRoutes from './routes/message.route.js';
import redis, { connectRedis } from './utils/redis.js';

dotenv.config();
connectDB();
connectRedis();
 
const __dirname = path.resolve()
const PORT = process.env.PORT || 5000;

app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'unsafe-none'); // Allow cross-origin messaging
  next();
});

app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(morgan("dev"))
app.use(express.json()); 


app.use("/api/redis", async (_req, res) => {
try {
const key = "test";
const value = `Redis is working! Time: ${new Date().toISOString()} `;

// Store the value for 60 seconds.
await redis.set(key, value, { EX: 60 });

// Read the value from Redis.
const cachedValue = await redis.get(key);

// Get the remaining expiration time.
const ttl = await redis.ttl(key);

return res.status(200).json({
  success: true,
  message: "Redis connection and read/write operations are working",
  data: {
    key,
    value: cachedValue,
    ttl,
  },
});

} catch (error) {
console.error("Redis test route error:", error);

return res.status(500).json({
  success: false,
  message: "Redis operation failed",
});

}
});
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/message', messageRoutes);

if(process.env.NODE_ENV === "production"){
 
  app.use(express.static(path.join(__dirname, "../client/dist")));
  app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, "../client", "dist", "index.html"))
  })
}

server.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
 
});
