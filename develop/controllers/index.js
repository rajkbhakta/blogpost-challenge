const router = require('express').Router();
const homeRoutes = require('./homeRoutes');
const apiRoutes = require('./api')
const dashboard = require('./dashboardRoutes')


//routes to all the routes
router.use('/', homeRoutes);
router.use('/api', apiRoutes);
 router.use('/dashboard', dashboard);

module.exports = router;
