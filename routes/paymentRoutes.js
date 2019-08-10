const express = require('express');
const router = express.Router();
const validationHandler = require('../validations/validationHandler')
const paypal = require('../config/paypal')

const { createPayment } = require('../controller/PaymentController')

router.get('/payment', createPayment);
router.get('/payment/execute', async (req, res, next) => {
    try {
        validationHandler(req)
        // Exécution du paiement
        if(req.query && req.query.paymentId && req.query.PayerID) {
            const execute_payment_json = {
                "payer_id": req.query.PayerID,
                "transactions": [{
                    "amount": {
                        "currency": "EUR",
                        "total": "10"
                    }
                }]
            };

            const paymentId = req.query.paymentId;

            await paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
                if (error) {
                    console.log(error.response);
                    throw error;
                } else {
                    console.log("Get Payment Response");
                    console.log(JSON.stringify(payment));
                    return res.send({payment})
                }
            });
        }
    } catch (error) {
        next(error)
    }
});

module.exports = router
