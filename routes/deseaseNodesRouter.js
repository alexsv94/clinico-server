const Router = require('express');
const nodesController = require('../controllers/deseaseNodesController')
const checkRole = require('../middleware/checkRoleMiddleware')

const router = new Router()

router.get('/symptoms', nodesController.getSymptoms)
router.get('/diagnostics', nodesController.getDiagnostics)

router.post('/symptoms', checkRole('ADMIN'), nodesController.createSymptom)
router.post('/diagnostics', checkRole('ADMIN'), nodesController.createDiagnostics)

router.put('/symptoms/:id', checkRole('ADMIN'), nodesController.updateSymptom)
router.put('/diagnostics/:id', checkRole('ADMIN'), nodesController.updateDiagnostic)

router.delete('/symptoms/:id', checkRole('ADMIN'), nodesController.deleteSymptom)
router.delete('/diagnostics/:id', checkRole('ADMIN'), nodesController.deleteDiagnostic)

module.exports = router