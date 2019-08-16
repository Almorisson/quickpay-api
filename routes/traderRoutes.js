const express = require('express');
const router = express.Router();

const {
        register, login, logout,
        findTraderById, profile,
        allTraders, getTraderById,
        unregister, update, getAllTradersRoutes
        } = require('../controller/TraderController');

const { isEmail, hasPassword, hasFirstName, hasLastName } = require('../validations/validators');
const { authenticate } = require('../helpers/authHelpers');

router.post('/register', register);
router.post('/login', [isEmail, hasPassword], login);
router.get('/logout', authenticate, logout);
//router.get('/profile', authenticate, profile);
router.get('/:traderId', authenticate, getTraderById);
router.delete('/:traderId', authenticate, unregister);
router.put('/:traderId', authenticate, update);
router.get('/', allTraders);

router.param("traderId", findTraderById) // any route with :traderId will execute this findTraderById() first

module.exports = router
