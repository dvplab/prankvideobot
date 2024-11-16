import fs from 'fs';
import path from 'path';
import bot from '../bot/bot.js';
import { config } from '../config/config.js';

// Папка для хранения фото
const photosDir = path.join(process.cwd(), 'public', 'photos');

// Убедитесь, что сервер может обслуживать статические файлы из папки public
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

        // Генерация уникального имени для фото
        const photoFilename = `photo_${Date.now()}.png`;

        // Путь к временному фото
        const photoPath = path.join(photosDir, photoFilename);

        // Сохраняем фото
        fs.writeFileSync(photoPath, buffer);

        // Проверяем, что файл существует
        if (!fs.existsSync(photoPath)) {
            return res.status(500).json({ error: 'Не удалось сохранить фото' });
        }

        // Создаем URL для фото
        const photoUrl = `${config.domain}/photos/${photoFilename}`;
        console.log(photoUrl);

        // Отправляем фото через Telegram API
        await bot.api.sendPhoto(userId, { photo: photoUrl });

        // Удаляем файл после отправки
        fs.unlinkSync(photoPath);

        res.json({ status: 'Фото отправлено в Telegram' });
    } catch (error) {
        console.error('Ошибка при отправке фото в Telegram:', error);
        res.status(500).json({ error: 'Ошибка отправки фото' });
    }
}
