const Router = require('express');
const userController = require('../controllers/userController')
const authMiddleWare = require('../middleware/authMiddleware');
const checkRole = require('../middleware/checkRoleMiddleware');
const favoritesRouter = require('./favoritesRouter')

const router = new Router();

router.post('/registration', userController.registration)
router.post('/login', userController.login)
router.get('/auth', authMiddleWare, userController.check)
router.get('/', checkRole('ADMIN'), userController.getAll)
router.put('/:id', authMiddleWare, userController.updateUser)
router.put('/:id/ban', checkRole('ADMIN'), userController.banUser)
router.put('/:id/unban', checkRole('ADMIN'), userController.unBanUser)
router.delete('/:id', checkRole('ADMIN'), userController.deleteUser)

router.use('/favorites', favoritesRouter)

module.exports = router