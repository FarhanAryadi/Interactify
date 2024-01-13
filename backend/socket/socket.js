import dotenv from 'dotenv';
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import Conversation from '../models/conversationModel.js';
import Message from '../models/messageModel.js';
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: [process.env.BASE_URL, 'http://localhost:3000'],
		methods: ['GET', 'POST'],
		credentials: true,
	},
});

export const getRecipientSocketId = (recipientId) => {
	return userSocketMap[recipientId];
};

const userSocketMap = {}; // userId: socketId

io.on('connection', (socket) => {
	console.log('user connected', socket.id);
	const userId = socket.handshake.query.userId;

	if (userId != 'undefined') userSocketMap[userId] = socket.id;
	io.emit('getOnlineUsers', Object.keys(userSocketMap));

	socket.on('markMessagesAsSeen', async ({ conversationId, userId }) => {
		try {
			await Message.updateMany(
				{ conversationId: conversationId, seen: false },
				{ $set: { seen: true } }
			);
			await Conversation.updateOne(
				{ _id: conversationId },
				{ $set: { 'lastMessage.seen': true } }
			);
			io.to(userSocketMap[userId]).emit('messagesSeen', { conversationId });
		} catch (error) {
			console.log(error);
		}
	});

	socket.on('disconnect', () => {
		console.log('user disconnected');
		delete userSocketMap[userId];
		io.emit('getOnlineUsers', Object.keys(userSocketMap));
	});
});

export { app, io, server };
