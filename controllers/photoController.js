import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';
import bot from '../bot/bot.js';

// Для корректной работы с __dirname в ES-модуле
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function sendPhotoToTelegram(req, res) {
    try {
        const { chatId, photoUrl } = req.body;

        if (!chatId || !photoUrl) {
            return res
                .status(400)
                .json({ error: 'Не указаны chatId или photoUrl' });
        }

        // Скачиваем файл на сервер
        const fileName = path.basename(photoUrl);
        const localPath = path.join(__dirname, 'tmp', fileName); // Путь к временной директории

        const response = await axios.get(photoUrl, { responseType: 'stream' });
        const writer = fs.createWriteStream(localPath);

        response.data.pipe(writer);

        await new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });

        // Отправляем файл в Telegram
        await bot.api.sendPhoto(chatId, { source: localPath });

        // Удаляем локальный файл
        fs.unlinkSync(localPath);

        res.status(200).json({ message: 'Фото успешно отправлено!' });
    } catch (error) {
        console.error('Ошибка при отправке фото в Telegram:', error);
        res.status(500).json({ error: 'Ошибка отправки фото' });
    }
}
