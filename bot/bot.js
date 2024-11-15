import { Bot } from 'grammy';
import axios from 'axios';
import { config } from '../config/config.js';

import Chat from '../models/chat.js';

// Место для хранения chat_id пользователей
const users = {};

const bot = new Bot(config.token);

// Функция для сохранения chatId
export async function saveChatId(userId, chatId) {
    try {
        let user = await Chat.findOne({ userId });

        if (user) {
            // Обновляем chatId, если пользователь уже существует
            user.chatId = chatId;
        } else {
            // Создаем нового пользователя, если его еще нет в базе
            user = new Chat({ userId, chatId });
        }

        await user.save();
        console.log(`Сохранен chatId для userId ${userId}: ${chatId}`);
    } catch (error) {
        console.error('Ошибка при сохранении chatId:', error);
    }
}

// Функция для проверки подписки пользователя на канал
export async function isSubscribed(userId) {
    try {
        const response = await axios.get(
            `https://api.telegram.org/bot${config.token}/getChatMember`,
            {
                params: {
                    chat_id: config.channelId,
                    user_id: userId,
                },
            }
        );
        const memberStatus = response.data.result.status;
        return (
            memberStatus === 'member' ||
            memberStatus === 'administrator' ||
            memberStatus === 'creator'
        );
    } catch (error) {
        console.error('Ошибка при проверке подписки:', error);
        return false;
    }
}

// Обработка команды "/start"
bot.command('start', async (ctx) => {
    const userId = ctx.from.id;
    const chatId = ctx.chat.id;

    // Сохраняем chatId
    saveChatId(userId, chatId);

    // Проверка подписки
    const subscribed = await isSubscribed(userId);

    if (subscribed) {
        const link = `${config.domain}/goodtest?userId=${userId}`;
        await ctx.reply(
            `🔗 Вот твоя ссылка:\n\nОтправляй ссылку друзьям, чтобы пранкануть их.\n<a href="${link}">${link}</a>`,
            { parse_mode: 'HTML' }
        );
    } else {
        await ctx.reply(
            `Подпишитесь на наш канал ${config.channelId}, чтобы получить доступ к ссылке.`
        );
    }
});

export default bot;
