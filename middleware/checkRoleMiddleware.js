const jwt = require('jsonwebtoken')

module.exports = function (role) {
	return function (req, res, next) {
		if (req.method === 'OPTIONS') {
			next()
		}

		try {
			const token = req.headers.authorization.split(' ')[1];

			if (!token) return res.status(401).json({ message: 'Пользователь не авторизован' })

			const decodedUser = jwt.verify(token, process.env.JWT_KEY);

			req.user = decodedUser

			if (decodedUser.role !== role) return res.status(403).json('Недостаточно прав');

			next()
		} catch (e) {
			res.status(401).json({ message: 'Пользователь не авторизован' })
		}
	}
}

