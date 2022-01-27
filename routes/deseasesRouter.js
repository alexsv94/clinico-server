const Router = require('express');
const deseasesController = require('../controllers/deseasesController')
const notesController = require('../controllers/notesController')
const checkRole = require('../middleware/checkRoleMiddleware')
const authMiddleware = require('../middleware/authMiddleware')

const nodesRouter = require('./deseaseNodesRouter')

const router = new Router()

router.post('/', checkRole('ADMIN'), deseasesController.create)
router.put('/:id', checkRole('ADMIN'), deseasesController.update)
router.delete('/:id', checkRole('ADMIN'), deseasesController.delete)
router.get('/', deseasesController.getAll)
router.get('/:id', deseasesController.getById)

router.post('/:id/notes', authMiddleware, notesController.create)
router.put('/:id/notes/:id', authMiddleware, notesController.update)
router.delete('/:id/notes/:id', authMiddleware, notesController.delete)


router.use('/nodes', nodesRouter)

module.exports = router