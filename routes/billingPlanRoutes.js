const express = require('express');
const router = express.Router();
const { authenticate } = require('../helpers/authHelpers')
const { createBillingPlan, executeBillingPlan } = require('../controller/BillingPlanController')

router.get('/subscription', createBillingPlan)
router.get('/subscription/execute', executeBillingPlan)


module.exports = router
