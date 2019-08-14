/**
 * @file QrcodeController.js
 * Controller QrcodeController
 * @author : Mor NDIAYE - Lucas CHEN
 * @copyright : 2019 - 2020 All rights reserved
 */

const Trader = require('../models/traders')
const validationHandler = require('../validations/validationHandler')

exports.generateQrCode = async(req, res, next) => {
    try {

        validationHandler(req)
        // Find trader infos to dump in the QRcode
        let trader = await Trader.findOne({_id: req.profile}).select("_id")

        
        // Get the text to generate QR code
        //let qr_txt = req.body.qr_text;
        let qr_txt = req.body.amount
        let segs = [
            {data: "34", mode: "numeric"},
            {data: "dfghjkl", mode: "alphanunumeric"}
        ];

        // Generate QR Code from text
        var qr_png = qr.imageSync(segs, { type: 'png'})

        // Generate a random file name
        let qr_code_file_name = `${quickpay}_${new Date().getTime()}_${Math.floor(Math.random() * Math.floor(9))}.png`;

        fs.writeFileSync(__dirname + '../public/qr/' + qr_code_file_name, qr_png, (err) => {
            if(err){
                console.log(err);
            }

        })
        // Send the link of generated QR code
        return res.send({
            'qr_img': "qr/" + qr_code_file_name
        });
    } catch (error) {
        next(error)
    }
};
