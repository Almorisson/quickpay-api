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

exports.generateQrCode = async(req, res, next) => {
    try {

        validationHandler(req)
        // Find trader infos to dump in the QRcode
        let trader = await Trader.findOne({_id: req.profile._id})

        const { iban, _id, nameSociety, qrCode } = trader
        // Get the text to generate QR code
        let amount = req.body.amount

        // Generate QR Code from text
        const __base = 'https://quickpay.herokuapp.com/';
        const qr_png = qr.imageSync(`${__base}api/v1/transactions/createAmountToPay?${iban}&${_id}&${amount}`, { type: 'png'})
        //console.log(qr_png)

        if(qr_png != null ) {
            trader.qrCode.data = qr_png
            trader.qrCode.contentType = 'png'
            await trader.save((err, trader)=> {
                if(err) {
                    return res.status(400).json({
                        error: err
                    })
                }
                return trader
            })
        }
        // Generate a random file name
        let qr_code_file_name = `${nameSociety.replace(' ', '')}_${new Date().getTime()}.png`;
        const file_name = path.join(__dirname, `../public/qr/${qr_code_file_name}`)
        fs.writeFileSync(file_name, qr_png, err => {
            if(err){
                console.log(err);
            }

        })
        // Send the link of generated QR code
        return res.send({
            'qr_img': `${__base}public/qr/${qr_code_file_name}`,
            trader: {_id, iban, qrCode }
        });
    } catch (error) {
        next(error)
    }
};
