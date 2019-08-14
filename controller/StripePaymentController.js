/**
 * @file QrcodeController.js
 * Controller StripePaymentController
 * @author : Mor NDIAYE - Lucas CHEN
 * @copyright : 2019 - 2020 All rights reserved
 */

const validationHandler = require('../validations/validationHandler')

// account_token controller
exports.account_token =  async(req, res, next) => {
        try {
            return stripe.tokens.create({
                account: {
                    individual: {
                        first_name: 'Lucas',
                        last_name: 'CHEN'
                    },
                    tos_shown_and_accepted: true,
                },
                }).then(resultat => res.status(200).json(resultat))
                .catch(error => res.status(400).json(error));
        } catch (error) {
            next(error)
        }
}

// account_stripe controller
exports.account_stripe = async(req, res, next) {
    try {
        return stripe.accounts.create({
        country:'US',
        type:'custom',
        account_token: req.body.token,
    }).then(resultat => res.status(200).json(resultat))
        .catch(error => res.status(400).json(error));
    } catch (error) {
        next(error)
    }
}

// transaction controller
exports.transaction = async(req, res, next) => {
    try {
        return await stripe.charges.create({
        amount: req.body.amount,
        currency: 'eur',
        source: req.body.token,
        description: 'Test payment'
    }).then(resultat => res.status(200).json(resultat))
    .catch(error => res.status(400).json(error));
    } catch (error) {
        next(error)
    }
}

// createStripeUser controller
exports.createStripeUser = async(req, res, next) => {
    try {
        validationHandler(req)
        return await stripe.customers.create({
            email: req.body.email,
            source: req.body.token
        }).then(resultat => res.status(200).json(resultat))
        .catch(error => res.status(400).json(error));
    } catch (error) {
        // next error
        next(error)
    }

}

// transfer controller
exports.transfer = function(req, res) {
    return stripe.transfers.create({
        amount: req.body.amount,
        currency: 'eur',
        destination: req.body.destination
    }).then(resultat => res.status(200).json(resultat))
    .catch(error => res.status(400).json(error));
}
