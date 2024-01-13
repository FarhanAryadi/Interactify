import { v2 as cloudinary } from 'cloudinary';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import connectDB from './db/connectDB.js';
import homeRoutes from './routes/homeRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import postRoutes from './routes/postRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { app, server } from './socket/socket.js';

dotenv.config();

connectDB();

const PORT = process.env.PORT || 5000;

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Middlewares
app.use(express.json({ limit: '50mb' })); // To parse JSON data in the req.body
app.use(express.urlencoded({ extended: true })); // To parse form data in the req.body
app.use(cookieParser());

const __dirname = path.resolve();

app.use(express.static(path.join(__dirname, '/frontend/dist')));

app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, 'frontend', 'dist', 'index.html'));
});

// Routes
app.use('/api', homeRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/messages', messageRoutes);

server.listen(PORT, () => console.log(`Server started at PORT ${PORT}`));
