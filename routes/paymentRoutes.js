const express = require('express');
const router = express.Router();
const { authenticate } = require('../helpers/authHelpers')
const { createPayment, executePayment } = require('../controller/PaymentController')
const { findCustomerById } = require('../controller/CustomerController')

router.get('/payment/:customerId', createPayment);
router.get('/payment/execute/:customerId', executePayment);

router.param("customerId", findCustomerById) // any route with :traderId will execute this findCustomerById() first

module.exports = router
