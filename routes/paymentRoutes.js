const express = require('express');
const router = express.Router();
const { authenticate } = require('../helpers/authHelpers')
const { createPayment, executePayment } = require('../controller/PaymentController')

router.post('/payment', createPayment); // TODO: appliquer le middleware authenticate avant déploiment finale
router.get('/payment/execute', executePayment); // Pas besoin d'appliquer authenticate sur cette route

module.exports = router
