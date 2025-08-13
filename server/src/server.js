import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv'
import { initializeSocket } from "./utils/socket.js";
import connectDB from './utils/db.js';
import cookieParser from 'cookie-parser';
import path from 'path';
import authRoutes from './routes/auth.route.js';
import userRoutes from './routes/user.route.js';
import messageRoutes from './routes/message.route.js';

dotenv.config();

const __dirname = path.resolve()
const PORT = process.env.PORT || 5000;

const app = express();
const server = http.createServer(app);

initializeSocket(server);

app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'unsafe-none');
  next();
});

app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/message', messageRoutes);

if(process.env.NODE_ENV === "production"){
  app.use(express.static(path.join(__dirname, "../client/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client", "dist", "index.html"))
  });
}

server.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
  connectDB();
});