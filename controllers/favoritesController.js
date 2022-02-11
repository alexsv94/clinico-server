const ApiError = require('../error/ApiError');
const { FavoriteDesease, FavoriteMedication, Desease, Medication } = require('../models/models');

class FavoritesController {

	//DESEASES

	async getFavoriteDeseases(req, res, next) {
		const user = req.user

		const favorites = await FavoriteDesease.findAll({ where: { userId: user.id }});
		const favoriteDeseases = []

		for (const f of favorites) {
			favoriteDeseases.push(await Desease.findByPk(f.deseaseId, { attributes: ['id', 'name'] }));
		}

		return res.json(favoriteDeseases);
	}

	async createFavoriteDesease(req, res, next) {
		const user = req.user
		const { deseaseId } = req.body

		if (deseaseId) {
			const favoriteDesease = await FavoriteDesease.create({ userId: user.id, deseaseId });
			return res.json({ message: 'Успешно' });
		} else {
			return next(ApiError.badRequest('Не задан идентификатор заболевания'))
		}
	}

	async deleteFavoriteDesease(req, res, next) {
		const { id } = req.params

		const result = await FavoriteDesease.destroy({ where: { deseaseId: id } })

		if (result > 0) return res.json({ message: `Удалено ${result} заболеваний из избранного` })
		else return next(ApiError.notFound('Заболевание не найдено в избранном'))
	}

	async checkDeseaseInFavorites(req, res, next) {
		const { id } = req.params

		const result = await FavoriteDesease.findOne({where: { deseaseId: id }});

		if (result) return res.json(true)
		else return res.json(false)
	}

	//MEDICATIONS

	async getFavoriteMedications(req, res, next) {
		const user = req.user

		const favorites = await FavoriteMedication.findAll({ where: { userId: user.id }});
		const favoriteMedications = []

		for (const f of favorites) {
			favoriteMedications.push(await Medication.findByPk(f.medicationId, { attributes: ['id', 'name'] }));
		}

		return res.json(favoriteMedications);
	}

	async createFavoriteMedication(req, res, next) {
		const user = req.user
		const { medicationId } = req.body

		if (!user) next(ApiError.notAuthorized('Пользователь не авторизован'))

		if (medicationId) {
			const favoriteMedication = await FavoriteMedication.create({ userId: user.id, medicationId });
			return res.json({ message: 'Успешно' });
		} else {
			return next(ApiError.badRequest('Не задан идентификатор лек. препарата'))
		}
	}

	async deleteFavoriteMedication(req, res, next) {
		const { id } = req.params

		const result = await FavoriteMedication.destroy({ where: { medicationId: id } })

		if (result > 0) return res.json({ message: `Удалено ${result} лек. препаратов из избранного` })
		else return next(ApiError.badRequest('Лек. препарат не найден в избранном'))
	}

	async checkMedicationInFavorites(req, res, next) {
		const { id } = req.params

		const result = await FavoriteMedication.findOne({where: { medicationId: id }});

		if (result) return res.json(true)
		else return res.json(false)
	}
}

module.exports = new FavoritesController();