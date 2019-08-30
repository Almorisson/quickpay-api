
/**
 * @file PaymentController.js
 * Controller PaymentController
 * @author : Mor NDIAYE - Lucas CHEN
 * @copyright : 2019 - 2020 All rights reserved
 */

const paypal = require('../config/paypal')
const validationHandler = require('../validations/validationHandler')
const Payment = require('../models/payments')
const Trader = require('../models/traders')
const Customer = require('../models/customers')

// createPayment controller
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
                "return_url": `https://quickpay-api.herokuapp.com/api/v1/payments/payment/execute`,
                "cancel_url": `https://quickpay-api.herokuapp.com/api/v1/payments/payment/cancel`
            },
            "transactions": [{
                "amount": {
                    "currency": "EUR",
                    "total": 10
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

// executePayment controller
exports.executePayment = async (req, res, next) => {
    try {
        validationHandler(req)
        // ExÃ©cution du paiement
        if (req.query && req.query.paymentId && req.query.PayerID) {
            const execute_payment_json = {
                "payer_id": req.query.PayerID
            };

            const paymentId = req.query.paymentId;

            await paypal.payment.execute(paymentId, execute_payment_json, async function (error, payment) {
                if (error) {
                    console.log(error.response);
                    throw error;
                } else {
                    console.log("Get Payment Response");
                    console.log(JSON.stringify(payment));
                    // Opérations effectuées dans la BDD
                    const pay = await new Payment();
                    pay.paymentId = paymentId
                    pay.payerId = req.query.PayerID
                    pay.state = payment.state
                    pay.amount = payment.transactions[0].amount.total
                    pay.merchantId = payment.transactions[0].payee.merchant_id
                    pay.traderStoreName = payment.payer.payer_info.business_name
                    pay.traderEmail = payment.transactions[0].payee.email
                    pay.customerEmail = payment.payer.payer_info.email
                    pay.shippingAddress.recipientName = payment.payer.payer_info.shipping_address.recipient_name
                    pay.shippingAddress.address = payment.payer.payer_info.shipping_address.line1
                    pay.shippingAddress.country = payment.payer.payer_info.shipping_address.country
                    pay.shippingAddress.city = payment.payer.payer_info.shipping_address.city
                    pay.shippingAddress.postalCode = payment.payer.payer_info.shipping_address.postal_code
                    pay.shippingAddress.codeCountry = payment.payer.payer_info.shipping_address.code_country
                    pay.trader = await Trader.findOne({ email: pay.traderEmail })
                        .populate("trader",
                            '_id email firstName lastName iban siretNumber\
                                                    nameSociety phoneNumber address postalCode city country'
                        )
                        .select("_id firstName lastName email iban nameSociety\
                                                    phoneNumber nameSociety phoneNumber address postalCode city country"
                        )
                        .exec((err, res) => {
                            if (err) {
                                return res.status.json({
                                    error: "An error was occured while trying to save transactions in the database."
                                })
                            }
                        })
                    pay.Customer = await Customer.findOne({ email: pay.customerEmail })
                        .populate("trader",
                            '_id email firstName lastName creditCard\
                                              phoneNumber address postalCode city country'
                        )
                        .select("_id firstName lastName email\
                                                phoneNumber nameSociety phoneNumber address postalCode city country"
                        ).exec((err, res) => {
                            if (err) {
                                return res.status.json({
                                    error: "An error was occured while trying to save transactions in the database."
                                })
                            }
                        })

                    // Save payment in the database
                    await pay.save(err => {
                        if (err) {
                            let error = new Error("Wrong Request ! You don't have permissions to update profile Trader.");
                            error.statusCode = 400;
                            throw error;
                        }
                        return res.status(400).json(err)
                    });

                    return res.send({ payment: pay })
                }
            });
        }
    } catch (error) {
        next(error)
    }
}
