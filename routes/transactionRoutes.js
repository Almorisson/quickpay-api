const express = require('express');
const router = express.Router();

const {
    findTraderById
} = require('../controller/TraderController');

const {
    createAmountToPay,
    findLastAmount
} = require('../controller/TransactionController');
const { authenticate } = require('../helpers/authHelpers');

router.post('/createAmountToPay/:traderId', authenticate, createAmountToPay);

router.get('/findLastAmount/:traderId', authenticate, findLastAmount);

router.param("traderId", findTraderById) // any route with :traderId will execute this findTraderById() first

module.exports = router
