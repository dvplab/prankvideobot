import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

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

        // Преобразуем base64 в буфер
        const buffer = Buffer.from(photoData, 'base64');

        // Указываем путь для сохранения
        const photoPath = path.join(
            __dirname,
            '..',
            'public',
            'photos',
            `photo_${Date.now()}.png`
        );
        fs.writeFileSync(photoPath, buffer);

        // Проверяем, что файл существует
        if (!fs.existsSync(photoPath)) {
            return res.status(500).json({ error: 'Не удалось сохранить фото' });
        }

        // Используем ReadStream для отправки файла
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
