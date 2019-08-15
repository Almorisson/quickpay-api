/**
 * @file APIDocsController.js
 * Controller APIDocsController
 * @author : Mor NDIAYE - Lucas CHEN
 * @copyright : 2019 - 2020 All rights reserved
 */
const APIDocs = require('../docs/apiDocs')
const APICustomersDocs = require('../docs/customersDocs')
const APITradersDocs = require('../docs/tradersDocs')
const APITransactionsDocs = require('../docs/transactionsDocs')
const validationHandler = require('../validations/validationHandler')

// allEndpoints controller
exports.getAllRoutes = (req, res) => {
    validationHandler(req)
    return res.json(APIDocs)
}

// allTradersEndpoints controller : Permet de lister toutes les routes disponible pour les traders
exports.getAllTradersRoutes = (req, res) => {
    validationHandler(req)
    return res.json(APITradersDocs)
}

// allCustomersEndpoints controller: Permet de lister toutes les routes disponible pour les customers
exports.getAllCustomersRoutes = (req, res) => {
    validationHandler(req)
    return res.json(APICustomersDocs)
}

// allTransactionsEndpoints controller: Permet de lister toutes les routes disponible pour les transactions
exports.getAllTransactionsRoutes = (req, res) => {
    validationHandler(req)
    return res.json(APITransactionsDocs)
}

