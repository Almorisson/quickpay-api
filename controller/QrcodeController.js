/**
 * @file QrcodeController.js
 * Controller QrcodeController
 * @author : Mor NDIAYE - Lucas CHEN
 * @copyright : 2019 - 2020 All rights reserved
 */

const Trader = require('../models/traders')
const validationHandler = require('../validations/validationHandler')
const path = require('path')
const qr = require('qr-image');
const fs = require('fs')
const config = require('../config')

exports.generateQrCode = async (req, res, next) => {
    try {

        validationHandler(req)
        // Find trader infos to dump in the QRcode
        let trader = await Trader.findOne({ _id: req.profile._id })

        const { iban, _id, nameSociety, qrCode, firstName, lastName } = trader
        // Get the text to generate QR code
        let amount = req.body.amount

        // Generate QR Code from text
        let __base = null
        process.env.NODE_ENV === "production" ? __base =  'https://quickpay-api.herokuapp.com/' : __base = `http://${config.HOST}:${config.PORT}/`;
        const qr_png = qr.imageSync(`${_id};${iban};${amount}`, { type: 'png'})
        //console.log(qr_png)
        // if(qr_png != null ) {
        //     //trader.qrCode.data = qr_png
        //     //trader.qrCode.contentType = 'png'
        //     await trader.save((err, trader)=> {
        //         if(err) {
        //             return res.status(400).json({
        //                 error: err
        //             })
        //         }
        //         return trader
        //     })
        // }
        // Generate a random file name
        const name = `${firstName}${lastName}`;
        let qr_code_file_name = `${nameSociety.replace(' ', '')}_${firstName}_${new Date().getTime()}.png`;
        const file_name = path.join(__dirname, `../public/qr/${qr_code_file_name}`)
        fs.writeFileSync(file_name, qr_png, err => {
            if (err) {
                console.log(err);
            }

        })
        // Send the link of generated QR code
        return res.send({
            'qr_img': `${__base}public/qr/${qr_code_file_name}`,
            trader: { _id, iban, qrCode }
        });
    } catch (error) {
        next(error)
    }
};
