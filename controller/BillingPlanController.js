/**
 * @file BillingPlanController.js
 * Controller BillingPlanController
 * @author : Mor NDIAYE - Lucas CHEN
 * @copyright : 2019 - 2020 All rights reserved
 */

const paypal = require('../config/paypal')
const validationHandler = require('../validations/validationHandler')
const BillingPlan = require('../models/billings')
const Trader = require('../models/traders')
const Customer = require('../models/customers')

// createBillingPlan controller
exports.createBillingPlan = async (req, res, next) => {
    try {

        validationHandler(req)

        var isoDate = new Date();
        isoDate.setSeconds(isoDate.getSeconds() + 14)
        isoDate.toISOString().slice(0, 19) + 'Z';

        var billingPlanAttributes = {
            "description": "Abonnement d'un commerçant",
            "merchant_preferences": {
                "auto_bill_amount": "yes",
                "cancel_url": "https://quickpay-api.herokuapp.com/billing-plans/subscription",
                "initial_fail_amount_action": "continue",
                "max_fail_attempts": "1",
                "return_url": "https://quickpay-api.herokuapp.com/billing-plans/subscription"
            },
            "name": "Abonnement d'un commerçant",
            "payment_definitions": [
                {
                    "amount": {
                        "currency": "EUR",
                        "value": "30"
                    },
                    "cycles": "0",
                    "frequency": "MONTH",
                    "frequency_interval": "1",
                    "name": "Abonnement d'un commerçant",
                    "type": "REGULAR"
                }
            ],
            "type": "INFINITE"
        };

        var billingPlanUpdateAttributes = [
            {
                "op": "replace",
                "path": "/",
                "value": {
                    "state": "ACTIVE"
                }
            }
        ];

        var billingAgreementAttributes = {
            "name": "Abonnement local",
            "description": "Acceptation de l'abonnement par le commerçant",
            "start_date": isoDate,
            "plan": {
                "id": "P-0NJ10521L3680291SOAQIVTQ"
            },
            "payer": {
                "payment_method": "paypal"
            }
        };
        // Create the billing plan
        paypal.billingPlan.create(billingPlanAttributes, function (error, billingPlan) {
            if (error) {
                console.log(error);
                throw error;
            } else {
                console.log("Create Billing Plan Response");
                console.log(billingPlan);

                // Activate the plan by changing status to Active
                paypal.billingPlan.update(billingPlan.id, billingPlanUpdateAttributes, function (error, response) {
                    if (error) {
                        console.log(error);
                        throw error;
                    } else {
                        console.log("Billing Plan state changed to " + billingPlan.state);
                        billingAgreementAttributes.plan.id = billingPlan.id;

                        // Use activated billing plan to create agreement
                        paypal.billingAgreement.create(billingAgreementAttributes, function (error, billingAgreement) {
                            if (error) {
                                console.log(error);
                                throw error;
                            } else {
                                console.log("Create Billing Agreement Response");
                                for (var index = 0; index < billingAgreement.links.length; index++) {
                                    if (billingAgreement.links[index].rel === 'approval_url') {
                                        var approval_url = billingAgreement.links[index].href;
                                        console.log("For approving subscription via Paypal, first redirect user to");
                                        console.log(approval_url);
                                        res.redirect(approval_url)
                                    }
                                }
                            }
                        });
                    }
                });
            }
        });

    } catch (error) {
        next(error)
    }
}

// executeBillingPlan controller
exports.executeBillingPlan = async (req, res, next) => {
    try {
        validationHandler(req)
        if(req.query && req.query.token){
            const paymentToken = req.query.token;
            await paypal.billingAgreement.execute(paymentToken, {}, function (error, billingAgreement) {
                if (error) {
                    console.log(error);
                    throw error;
                } else {
                    console.log("Billing Agreement Execute Response")
                    console.log(JSON.stringify(billingAgreement))
                    res.send({billingAgreement})
                    // TODO: Insertion des infos en BDD
                }
            });
        }

    } catch (error) {
        next(error)
    }
}








