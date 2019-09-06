const bcrypt = require('bcryptjs')
const validator = require("email-validator")
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { ObjectId } = Schema

const PaymentSchema = mongoose.Schema({
    paymentId: {type: String, required: true},
    payerId: {type: String, required: true},
    state: {type: String, required: true},
    amount: {type: Number, required: true},
    merchantId: {type: String, required: true},
    traderStoreName: {type: String, required: true},
    traderEmail: {type: String, required:true},
    customerEmail: {type: String, required:true},
    shippingAddress: {
        recipientName: {type: String, required: true},
        address: {type: String, required: true, unique: true},
        country: {type: String, required: true, default: "France"},
        city: {type: String, required: true, minLength: 5, maxLength: 255},
        postalCode: {type: String, required: true, min: 5, max: 5},
        codeCountry: {type: String, required: false, default: "FR"},
        phoneNumber: {type: String, required: true},
    },
    siretNumber: {type: String, required: true, unique: true, min: 10, max: 30},
    iban: {type: String, required: true, max: 34, unique: true},
    created_at: {type: Date, required: true, default: Date.now()},
    //trader: {type: ObjectId, ref: "Trader"},
    //customer: {type: ObjectId, ref: "Customer"},

}, {versionKey: false // You should be aware of the outcome after set to false
})

module.exports = mongoose.model('Payment', PaymentSchema);
