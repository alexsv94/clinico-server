const ApiError = require('../error/ApiError');
const { User, Favorites } = require('../models/models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

const generateJwt = (user) => {
	return jwt.sign(
		{ id: user.id, email: user.email, firstname: user.firstname, lastname: user.lastname, role: user.role },
		process.env.JWT_KEY,
		{ expiresIn: '24h' }
	);
}

class UserController {
	async registration(req, res, next) {
		const { email, password, firstname, lastname, role } = req.body

		if (!email || !password || !firstname || !lastname) return next(ApiError.badRequest('Заполните все поля'))

		const candidate = await User.findOne({ where: { email } });

		if (candidate) return next(ApiError.badRequest('Пользователь существует'))

		const hashPassword = await bcrypt.hash(password, 5);
		const user = await User.create({ email, role, firstname, lastname, password: hashPassword });
		const favorites = await Favorites.create({ userId: user.id });
		const token = generateJwt(user);
		return res.json({ token });
	}

	async login(req, res, next) {
		const { email, password } = req.body
		
		if (!email || !password)
			return next(ApiError.badRequest('Неверный E-mail или пароль'))

		const user = await User.findOne({ where: { email } });

		if (!user) return next(ApiError.badRequest('Пользователь не найден'))

		if (user.banned)  return next(ApiError.badRequest('Пользователь забанен'))

		if (!bcrypt.compareSync(password, user.password))
			return next(ApiError.badRequest('Неверный пароль'))

		const token = generateJwt(user);
		return res.json({ token });
	}

	async check(req, res, next) {
		const token = generateJwt(req.user);
		return res.json({ token })
	}

	async updateUser(req, res, next) {
		const { id } = req.params;
		const { user } = req.body;

		if (!user.email || !user.firstname || !user.lastname)
			return next(ApiError.badRequest('Заполнены не все данные'));

		const candidate = await User.findByPk(id);
		if (!candidate) return next(ApiError.badRequest('Пользователь не найден'));

		if (req.user.id !== user.id) {
			if (req.user.role !== 'ADMIN')
				return next(ApiError.badRequest('Доступ запрещен'));
		}

		await User.update({
			email: user.email,
			role: user.role || req.user.role,
			firstname: user.firstname,
			lastname: user.lastname
		}, { where: { id } });

		async function updateUserPassword() {
			const userInDataBase = await User.findByPk(id);

			if (!bcrypt.compareSync(user.password, userInDataBase.password))
				return false;

			const hashPassword = await bcrypt.hash(user.newPassword, 5);

			await User.update({ password: hashPassword }, { where: { id } });

			return true;
		}

		if (user.newPassword) {
			const result = await updateUserPassword();

			if (result) {
				const updatedUser = await User.findByPk(id);
				return res.json({ token: generateJwt(updatedUser) })
			} else {
				return next(ApiError.badRequest('Неверно указан пароль'));
			}
		}

		const updatedUser = await User.findByPk(id);
		return res.json({ token: generateJwt(updatedUser) });
	}

	async banUser(req, res, next) {
		const userId = req.originalUrl.split('/')[3]

		const candidate = await User.findByPk(userId);
		if (!candidate) return next(ApiError.badRequest('Пользователь не найден'));

		await User.update({ banned: true }, { where: { id: userId } });

		return res.json({ message: `Пользователь ${candidate.firstname} ${candidate.lastname} заблокирован` });
	}

	async unBanUser(req, res, next) {
		const userId = req.originalUrl.split('/')[3]

		const candidate = await User.findByPk(userId);
		if (!candidate) return next(ApiError.badRequest('Пользователь не найден'));

		await User.update({ banned: false }, { where: { id: userId } });

		return res.json({ message: `Пользователь ${candidate.firstname} ${candidate.lastname} разблокирован` });
	}

	async deleteUser(req, res, next) {
		const { id } = req.params;

		const candidate = await User.findByPk(userId);
		if (!candidate) return next(ApiError.badRequest('Пользователь не найден'));

		const result = await User.destroy({ where: { id } });

		return res.json(result > 0 ? { message: `Пользователь ${candidate.firstname} ${candidate.lastname} удален` } : { message: 'Пользователь не найден' });
	}

	async getAll(req, res, next) {
		const users = await User.findAll();
		return res.json(users);
	}
}

module.exports = new UserController();