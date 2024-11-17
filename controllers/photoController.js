import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bot from '../bot/bot.js';

// Определяем __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function sendPhotoToTelegram(req, res) {
    try {
        const { userId, photoData } = req.body;

        if (!userId || !photoData) {
            return res
                .status(400)
                .json({ error: 'Пользователь или фото не указаны' });
        }

        // Преобразуем base64-данные в буфер
        const buffer = Buffer.from(photoData, 'base64');

        // Путь для сохранения фото
        const photoPath = path.join(
            __dirname,
            '..',
            'public',
            'photos',
            `photo_${Date.now()}.png`
        );

        // Сохраняем фото
        fs.writeFileSync(photoPath, buffer);

        // Проверяем, что файл существует
        if (!fs.existsSync(photoPath)) {
            return res.status(500).json({ error: 'Не удалось сохранить фото' });
        }

        // Отправляем фото в Telegram
        await bot.api.sendPhoto(userId, {
            source: fs.createReadStream(photoPath),
        });

        // Удаляем файл после отправки
        fs.unlinkSync(photoPath);

        res.json({ status: 'Фото отправлено в Telegram' });
    } catch (error) {
        console.error('Ошибка при отправке фото в Telegram:', error);
        res.status(500).json({ error: 'Ошибка отправки фото' });
    }
}
