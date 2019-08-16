/**
 * @file qrcodeRoutes.js
 * Route qrcodeRoutes
 * @author : Mor NDIAYE - Lucas CHEN
 * @copyright : 2019 - 2020 All rights reserved
 */

const express = require('express');
const router = express.Router();
const { authenticate } = require('../helpers/authHelpers')
const { generateQrCode } = require('../controller/QRCodeController')
const { findTraderById } = require('../controller/TraderController')


router.post('/:traderId/generate', authenticate, generateQrCode);

router.param("traderId", findTraderById);

module.exports = router;
