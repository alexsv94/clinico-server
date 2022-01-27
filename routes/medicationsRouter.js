const Router = require('express');
const medicationsController = require('../controllers/medicationsController');
const checkRole = require('../middleware/checkRoleMiddleware');

const router = new Router()

router.post('/', checkRole('ADMIN'), medicationsController.create)
router.put('/:id', checkRole('ADMIN'), medicationsController.update)
router.delete('/:id', checkRole('ADMIN'), medicationsController.delete)
router.get('/', medicationsController.getAll)
router.get('/:id', medicationsController.getById)

module.exports = router