const Router = require('express');
const userRouter = require('./userRouter');
const deseasesRouter = require('./deseasesRouter');
const medicationsRouter = require('./medicationsRouter');
const favoritesRouter = require('./favoritesRouter');


const router = new Router()

router.use('/user', userRouter)
router.use('/deseases', deseasesRouter)
router.use('/medications', medicationsRouter)
router.use('/favorites', favoritesRouter)

module.exports = router