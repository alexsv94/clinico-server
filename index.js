require('dotenv').config();
const DB = require('./dataBase')
const express = require('express');
const cors = require('cors');
const path = require('path')
const router = require('./routes/index')
const errorHandler = require('./middleware/errorHandlingMiddleware');
const fileUpload = require('express-fileupload');

const PORT = process.env.APP_PORT || 5000;

const app = express(); // Создание объекта приложения
app.use(cors());
app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'static')));
app.use(fileUpload({}));
app.use('/api', router);

app.use(errorHandler) //Обработчик ошибок подключается в последнюю очередь

const start = async () => {
	try {
		await DB.authenticate(); 															//Подключение к БД по указанным параметрам в файле dataBase.js
		await DB.sync(); 																		//Синхронизация БД с описанными моделями данных
		app.listen(PORT, process.env.APP_IP,
			() => { console.log('SERVER STARTED ON PORT ' + PORT) });	//Назначение прослушиваемого порта для приложения
	} catch (e) {
		console.log('ERROR ON START: ' + e.message);
	}
}

start();