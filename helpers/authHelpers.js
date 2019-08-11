/**
 * @author : Mor NDIAYE - Lucas CHEN
 * @copyright : 2019 - 2020
 *  Protège certaines routes contre les utilisateurs non connectés
 */

const expressJwt = require('express-jwt')
const config = require('../config')

exports.authenticate = expressJwt({
    secret: config.JWT_SECRET_KEY,
    userProperty: "auth"
});
