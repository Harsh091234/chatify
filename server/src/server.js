import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv'
import {server, app} from "./utils/socket.js"
import connectDB from './utils/db.js';
import cookieParser from 'cookie-parser';
dotenv.config();

import authRoutes from './routes/auth.route.js';
import userRoutes from './routes/user.route.js';
import messageRoutes from './routes/message.route.js';


const PORT = process.env.PORT || 5000;
app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'unsafe-none'); // Allow cross-origin messaging
  next();
});
app.use(cookieParser());
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));
app.use(express.json()); 


app.get('/', (req, res) => {
  res.send('Server is running!');
});

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/message', messageRoutes);

server.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
  connectDB();
});
