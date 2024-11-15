import dotenv from 'dotenv';
dotenv.config(); // Загружает переменные окружения из .env

export const config = {
    token: process.env.TOKEN,
    channelId: process.env.CHANNEL_ID,
    port: process.env.PORT,
    mongoURI: process.env.MONGO_URI,
    domain: process.env.DOMAIN,
};
