import bot from '../bot/bot.js';
import Chat from '../models/chat.js';

export async function notifyClick(req, res) {
    const { message, userId } = req.body;

    // Функция для получения chatId по userId
    async function getChatId(userId) {
        try {
            const user = await Chat.findOne({ userId });
            if (user) {
                return user.chatId;
            } else {
                console.log(`chatId не найден для userId ${userId}`);
                return null;
            }
        } catch (error) {
            console.error('Ошибка при получении chatId:', error);
            return null;
        }
    }

    // Получаем chatId из базы данных
    const chatId = await getChatId(userId);

    console.log(`Received request: userId: ${userId}, message: ${message}`);
    console.log(`chatId для userId ${userId}: ${chatId}`);

    if (!message || !userId || !chatId) {
        console.error('Ошибка: Неверные данные или chat_id не найден');
        return res
            .status(400)
            .json({ error: 'Неверные данные или chat_id не найден' });
    }

    try {
        await bot.api.sendMessage(chatId, `Уведомление с сайта: ${message}`);
        res.json({ status: 'Уведомление отправлено в чат' });
    } catch (error) {
        console.error('Ошибка отправки уведомления:', error);
        res.status(500).json({ error: 'Ошибка отправки уведомления в чат' });
    }
}
