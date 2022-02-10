const Router = require('express');
const favoritesController = require('../controllers/favoritesController')
const authMiddleWare = require('../middleware/authMiddleware')

const router = new Router()

router.post('/deseases', authMiddleWare, favoritesController.createFavoriteDesease)
router.get('/deseases', authMiddleWare, favoritesController.getFavoriteDeseases);
router.delete('/deseases/:id', authMiddleWare, favoritesController.deleteFavoriteDesease)

router.post('/medications', authMiddleWare, favoritesController.createFavoriteMedication)
router.get('/medications', authMiddleWare, favoritesController.getFavoriteMedications);
router.delete('/medications/:id', authMiddleWare, favoritesController.deleteFavoriteMedication)

module.exports = router