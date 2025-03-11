import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import {connectDB} from './lib/db.js';
import authRoutes from './routes/auth.route.js';
import itemRoutes from './routes/item.route.js';
import orderRoutes from './routes/order.route.js';
import rentRoutes from './routes/rent.route.js';
import tradeRoutes from './routes/trade.route.js';
import rentorderRoutes from './routes/rentorder.route.js';
import messageRoutes from './routes/message.route.js';
import {server,app} from './lib/socket.js';

dotenv.config();
const PORT = process.env.PORT;

app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());
app.use(cors(
    {
        origin: "http://localhost:5173",
        credentials: true
    }
));
app.use("/api/auth",authRoutes);

app.use("/api/market",itemRoutes);

app.use("/api/order",orderRoutes);

app.use("/api/rent",rentRoutes);

app.use("/api/rentorder",rentorderRoutes);

app.use("/api/trade",tradeRoutes);

app.use("/api/messages",messageRoutes);
server.listen(PORT, () => {
    console.log('Server is running on port '+PORT);
    connectDB();
});