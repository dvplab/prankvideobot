import mongoose from 'mongoose';
import bot from '../bot/bot.js';

const chatSchema = new mongoose.Schema({
    userId: { type: Number, required: true, unique: true }, // Идентификатор пользователя
    chatId: { type: Number, required: true }, // chatId для отправки сообщений
});

const Chat = mongoose.model('Chat', chatSchema); // Создаем модель

export default Chat;
