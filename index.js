import express from 'express';
import cors from 'cors';
import { config } from './config/config.js';
import bot from './bot/bot.js';
import webRoutes from './routes/webRoutes.js';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './db/db.js';

const app = express();
app.use(express.json());
app.use(cors());

// Настройка EJS как шаблонизатора
app.set('view engine', 'ejs');
app.set('views', 'src/views');

// Раздача статики
app.use(express.static('public'));

// Главная страница
app.get('/', (req, res) => {
    res.render('index', {
        title: 'Главная страница',
        message: 'Добро пожаловать!',
    });
});

// Получение значения __dirname в среде ES-модулей
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Подключаем папку public как статическую
app.use(express.static(path.join(__dirname, 'public')));

// Подключение маршрутов
app.use('/api', webRoutes);
app.use(webRoutes);

// Подключение к базе данных
connectDB();

// Запуск сервера
app.listen(config.port, () => {
    console.log(`Сервер запущен на порту ${config.port}`);
});

// Запуск бота
bot.start();
