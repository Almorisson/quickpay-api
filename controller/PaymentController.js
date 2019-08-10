
/**
 * @file PaymentController.js
 * Controller PaymentController
 * @author : Mor NDIAYE - Lucas CHEN
 * @copyright : 2019 - 2020 All rights reserved
 */

const paypal = require('../config/paypal')
const validationHandler = require('../validations/validationHandler')

exports.createPayment = async (req, res, next) => {
    try {
        validationHandler(req)
        // Les données à envoyer à l'API de PAYPAL pour créer un paiement
        const create_payment_json = {
            "intent": "authorize",
            "payer": {
                "payment_method": "paypal"
            },
            "redirect_urls": {
                "return_url": "http://localhost.com:3000/api/v1/transactions/payment/execute",
                "cancel_url": "http://localhost.com:3000/api/v1/transactions/payment/cancel"
            },
            "transactions": [{
                "amount": {
                    "currency": "EUR",
                    "total": "10"
                },
                "description": "Customer pays Trader with PayPal."
            }]
        };

        // Création du paiement

        await paypal.payment.create(create_payment_json, function (error, payment) {
            if (error) {
                console.log(error.response);
                throw error;
            } else {
                for (var index = 0; index < payment.links.length; index++) {
                //Redirect user to this endpoint for redirect url
                    if (payment.links[index].rel === 'approval_url') {
                        console.log("En cours de création");

                        console.log(payment.links[index].href);
                        res.redirect(payment.links[index].href);
                    }
                }
                console.log(payment);
            }
        });
    } catch (error) {
        next(error)
    }
}
