const ApiError = require('../error/ApiError');
const { Favorites } = require('../models/models');

class FavoritesController {

	async getAll(req, res, next) {
		const { user } = req.user
		const favorites = await Favorites.findAll({ where: { userId: user.id } });
		return res.json(favorites);
	}
}

module.exports = new FavoritesController();