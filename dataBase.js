const { Sequelize } = require('sequelize');

module.exports = new Sequelize(		//конфигурация подключения к БД
	process.env.DBNAME,
	process.env.DBUSER,
	process.env.DBPASS,
	{
		dialect: 'mysql',
		host: process.env.DBHOST,
		port: process.env.DBPORT,
		dialectOptions: {
			socketPath: process.env.MYSQL_SOCKET,
		},
	}
)