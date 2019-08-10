const dotenv = require('dotenv')
const paypal = require('paypal-rest-sdk');

// Load ENV Variables
dotenv.config()

paypal.configure({
  'mode': process.env.PAYPAL_MODE, //sandbox or live
  'client_id': process.env.PAYPAL_CLIENT_ID,
  'client_secret': process.env.PAYPAL_CLIENT_SECRET
});

module.exports = paypal
