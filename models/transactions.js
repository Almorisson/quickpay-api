const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema

const TransactionSchema = mongoose.Schema({
    amount: {
            type: Number,
            required: true,
            default: 0
    },
    state: {
        toPay: {
            type: Boolean,
            default: false
        },
        pending: {
            type: Boolean,
            default: false
        },
        payed: {
            type: Boolean,
            default: false
        },
        canceled: {
            type: Boolean,
            default: false
        },
    },
    trader: {type: ObjectId, ref: "Trader"},
    customer: {typ: ObjectId, ref: "Customer"}
}, {versionKey: false // You should be aware of the outcome after set to false
})

module.exports = mongoose.model('Transaction', TransactionSchema);

