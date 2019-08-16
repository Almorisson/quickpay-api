/**
 * @file apiDocsRoutes.js
 * Controller apiDocsRoutes
 * @author : Mor NDIAYE - Lucas CHEN
 * @copyright : 2019 - 2020 All rights reserved
 */
const  router               = require('express').Router()
const {
    getAllRoutes,
    getAllCustomersRoutes,
    getAllTradersRoutes,
    getAllTransactionsRoutes
}                           = require('../controller/APIDocsController')

router.get('/', getAllRoutes)
router.get('/api/v1/customers/docs', getAllCustomersRoutes)
router.get('/api/v1/traders/docs', getAllTradersRoutes)
router.get('/api/v1/transactions/docs', getAllTransactionsRoutes)

module.exports = router
