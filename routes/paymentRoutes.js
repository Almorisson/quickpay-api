const express = require('express');
const router = express.Router();
const { authenticate } = require('../helpers/authHelpers')
const { createPayment, executePayment } = require('../controller/PaymentController')

router.get('/payment', createPayment); // TODO: appliquer le middleware authenticate avant déploiment finale
router.get('/payment/execute', executePayment);

module.exports = router
