const Router = require('express');
const favoritesController = require('../controllers/favoritesController')
const authMiddleWare = require('../middleware/authMiddleware')

const router = new Router()

router.get('/favorites', authMiddleWare, favoritesController.getAll)

module.exports = router