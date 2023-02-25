const express = require('express')
const router = express.Router()

// //Middle ware that is specific to this router
// router.use(function timeLog(req, res, next) {
//     console.log('Time: ', Date.now());
//     next();
// });

// const { login, dashboard } = require('../controllers/main')

// const authMiddleware = require('../middleware/auth')
// Define the home page route
router.get('/', function (req, res) {
    res.send('Home page');
});

router.get('/:user', function (req, res) {
    res.send(`${req.params.user} Social media Links`)
})

router.get('/:user/dashboard', function (req, res) {
    res.send(`Welcome ${req.params.user}! Dashboard `)
})

module.exports = router



