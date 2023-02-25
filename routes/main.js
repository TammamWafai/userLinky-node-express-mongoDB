const express = require('express')
const router = express.Router()
const { createSocialMedia,
    deleteSocialMedia,
    getAllSocialMedias,
    updateSocialMedia,
    getSocialMedia,
    register,
    login, mainPage } = require('../controllers/main')

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

router.get('/:user', mainPage)

router.get('/:user/dashboard', login)

module.exports = router



