/**
 * @author : Mor NDIAYE - Lucas CHEN
 * Fichier permetttant de générer les tokens de connexion
 * Et de protéger certains routes
 * (On n'accède à ces routes que si on est connecté)
 *
 */

const passport = require('passport')
const passportJWT =  require('passport-jwt')
const User = require('../models/customers')
const Trader = require('../models/traders')
//const config = require('../config')

const ExtractJwt = passportJWT.ExtractJwt
const Strategy = passportJWT.Strategy
const dotenv = require('dotenv')
// Load ENV Variables
dotenv.config()

const params = {
    secretOrKey: process.env.JWT_SECRET_KEY,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
}

module.exports = () => {
    const userStrategy = new Strategy(params, async (payload, done) => {
        // if the user is a customer
            const user = await User.findById(payload.id);
            if(!user) {
                return done(new Error("User not found !"), null);
            }
            return done(null, user)
    });

    const traderStrategy = new Strategy(params, async(payload, done) => {
        // if the user is a trader
            const trader = await Trader.findById(payload.id);
            if(!trader) {
                return done(new Error("Trader not found !"), null);
            }
            return done(null, trader)
    });

    passport.use(userStrategy);
    passport.use(traderStrategy);

    return {

        initialize: function () {
            return passport.initialize()
        },

        authenticate: function () {
            return passport.authenticate("jwt", {session: false})
        }
    }
}
