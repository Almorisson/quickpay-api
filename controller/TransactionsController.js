/**
 * @file TransactionsController.js
 * TransactionsController
 * @author : Mor NDIAYE - Lucas CHEN
 * @copyright : 2019 - 2020 All rights reserved
 */

const Trader = require('../models/traders')
const Transaction = require('../models/transactions')
const validationHandler = require('../validations/validationHandler')

exports.createAmountToPay = async(req, res, next) => {
    
    try {
        let transaction = await new Transaction();
        transaction.amount = req.body.amount;
        transaction.state.toPay = true;
        const trader = await Trader.findById({_id: req.profile._id}).select("_id")
        if(!trader) {
            const error = new Error("Not found trader")
            error.statusCode = 401;
            throw error;
        } else {
            transaction.trader = req.profile._id;
        }
        transaction = await transaction.save();
        return res.status(200).json({
            'message': 'success',
            'transaction': {transaction}
        });    
    } catch (error) {
        next(error)
    }
}

exports.findLastAmount = async(req, res, next) => {
    try {
        const transaction = await Transaction.find((error, transaction) => {
            if (error) {
                return res.status(400).json({'message': 'ERROR'});
            }
            return 1;
        })
        .populate("trader", "_id")
        .limit(1)
        .sort({'created_at': -1})
        .exec();
        
    } catch (error) {
        
    }
}