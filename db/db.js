import mongoose from 'mongoose';
import { config } from '../config/config.js'; // Здесь должен быть ваш файл с конфигурацией

// Подключение к базе данных
const connectDB = async () => {
    try {
        await mongoose.connect(config.mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB подключен');
    } catch (error) {
        console.error('Ошибка подключения к MongoDB:', error);
        process.exit(1); // Завершаем процесс, если не удается подключиться
    }
};

export default connectDB;
