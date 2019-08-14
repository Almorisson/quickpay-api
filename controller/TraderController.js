/**
 * @file TraderController.js
 * Controller TraderController
 * @author : Mor NDIAYE - Lucas CHEN
 * @copyright : 2019 - 2020 All rights reserved
 */

const
    Trader              =   require('../models/traders')
    jwt                 =   require('jsonwebtoken'),
    jwt_decode          =   require('jwt-decode'),
    { capitalize }      =   require('../helpers'),
    _                   =   require('lodash') // convention de nommage pour stocker l'objet {lodash}
    config              =   require('../config')
    validationHandler   =   require('../validations/validationHandler')
    formidable          =   require('formidable')

// module.exports = {
//     registerTrader: async function(req, res) {

//         await Trader.findOne({
//             'email': req.body.email
//         }, function(err, trader) {
//             if (trader) {
//                 return res.json({message: "Registration failed. The email is already taken."})
//             } else {
//                 const trader = new Trader({
//                     _id: new mongoose.Types.ObjectId(),
//                     firstName: req.body.firstName,
//                     lastName: req.body.lastName,
//                     nameSociety: req.body.nameSociety,
//                     email: req.body.email,
//                     password: bcrypt.hashSync(req.body.password, 10),
//                     picture: "",
//                     phoneNumber: req.body.phoneNumber,
//                     //birthDay: req.body.birthDay,
//                     address: req.body.address,
//                     postalCode: req.body.postalCode,
//                     city: req.body.city,
//                     siretNumber: req.body.siretNumber,
//                     iban: req.body.iban
//                 })
//                 if (trader.validateEmail(req.body.email)) {
//                     trader.save().then(result => {
//                         console.log(result);
//                     }).catch(err => console.log(err));
//                     return res.json({
//                         message: "Registration success !",
//                         register: trader
//                     });
//                 } else {
//                     return res.json({
//                         message: "Registration failed. Incorrect email syntax."
//                     })
//                 }
//             }
//         })
//     },
//     login: async function(req, res){
//         await Trader.findOne({
//                 email:req.body.email
//             }, function(err, trader) {
//                 if (err) {
//                     return res.send(err);
//                 }
//                 if (trader) {
//                     if (!trader.validPassword(req.body.password)) {
//                         return res.status(401).json({message: 'Authentication failed. Invalid password.'}); // avoid to send text in the api
//                     }
//                     return res.json({
//                         login: req.body.email,
//                         message: "Login successful !",
//                         token: jwt.sign({email: trader.email, trader: trader._id}, 'secret')
//                     });
//                 } else {
//                     return res.status(400).json({message: 'Authentication failed. Invalid username.'});
//                 }
//             }
//         )
//     },

//     profile: async function(req, res) {
//         if (req.headers.token != null) {
//             var email = jwt_decode(req.headers.token).email;
//             await Trader.findOne({
//                 email: email
//             }, function(err, trader) {
//                 if (trader)
//                     res.status(200).json(trader)
//                 else
//                     res.status(400).json({message: "Profile not found."});
//             })
//         } else {
//             res.send({message: "Access to profile forbidden ! You need to send the authentication token."}) // avoid to send text in the api
//         }
//     },

//     findTraderById: async function(req, res, next) {
//         let trader = await Trader.findById({_id: req.body.id});
//         if(!trader) {
//             return res.status(401).json({message: "Trader not found"})
//         }
//         return res.send({trader})
//     },

//     unregister: async function(req, res) {
//         //if (req.headers.token != null) {
//         let trader = await Trader.findById({_id: req.body.id});
//         if(!trader) {
//             return res.status(401).json({message: "Trader not found"})
//         }
//         trader.remove();
//         return res.send({message: "Unregister successful !"});
//     },
// }

// register controller
exports.register = async (req, res, next) => {
    try {
        validationHandler(req);

        const existingTrader = await Trader.findOne({email: req.body.email})
        if(existingTrader) {
            const error = new Error("Email is already in used!")
            error.statusCode = 403;
            throw error;
        }
        let trader = new Trader();
        trader.firstName = capitalize(req.body.firstName)
        trader.lastName = req.body.lastName.toUpperCase()
        trader.email = req.body.email
        trader.nameSociety = capitalize(req.body.nameSociety)
        trader.password = await trader.encryptPassword(req.body.password)
        trader.phoneNumber = req.body.phoneNumber,
        //birthDay: req.body.birthDay,
        trader.address = req.body.address,
        trader.postalCode = req.body.postalCode,
        trader.city = capitalize(req.body.city),
        trader.siretNumber = req.body.siretNumber,
        trader.iban = req.body.iban

        if(req.body.country && req.body.country !== "") {
            trader.country = capitalize(req.body.country)
            let tempStr= req.body.country.substring(0, 2)
            trader.codeCountry = tempStr.toUpperCase()
        }

        // if (files.picture) {
        //         customer.picture.data = fs.readFileSync(files.picture.path);
        //         customer.picture.contentType = files.picture.type;
        // }

        // if (req.body.qrCode != undefined) {
        //     customer.qrCode.data = fs.writeSync([req.body.iban, req.body.siretNumber, req.body.email]); // Appeler la fonction générer QRcode
        //     customer.qrCode.contentType = res.set("Content-Type", "png");
        // }
        trader.qrCode = req.body.qrCode

        trader = await trader.save();

        const token = jwt.sign({id: trader.id}, config.JWT_SECRET_KEY)
        return res.send({trader, token})

    } catch (err) {
        next(err)
    }
}
// login controller
exports.login = async (req, res, next) => {
    try {
        validationHandler(req);

        const email = req.body.email
        const password = req.body.password

        const trader = await Trader.findOne({email}).select("+password")
        if(!trader) {
            const error = new Error("Wrong Email")
            error.statusCode = 401;
            throw error;
        }

        const validPassword = await trader.validPassword(password)
        if(!validPassword) {
            const error = new Error("Wrong Password")
            error.statusCode = 401;
            throw error;
        }

        const token = jwt.sign({id: trader.id}, config.JWT_SECRET_KEY)
        res.cookie("tok", token, {expire: new Date() + 99999})

        return res.send({trader, token})
    } catch (err) {
        next(err)
    }
}

// logout controller
exports.logout = async (req, res, next) => {
    try {
            const response = await res.clearCookie("tok")

            if(!response) {
                const error = new Error("Something went wrong when trying to log out you !")
                error.statusCode = 500;
                throw error;
            }

            return res.send({"message": "Logged out successfully !"});
    } catch (err) {
        next(err)
    }
}

// profile controller
exports.profile = async function(req, res, next) {
        try {

            validationHandler(req)

            if (req.headers.token != null) {
                let email = await jwt_decode(req.headers.token).email;
                await Trader.findOne({
                    email: email
                }, function(err, trader) {
                    if (trader)
                        return res.status(200).json(trader)
                    else
                        return res.status(400).json({message: "Profile not found" + err});
                })
            } else {
                return res.send({message: "Trader Access to profile forbidden ! You need to send the authentication token."})
            }

            // const trader = await Trader.findById(req.trader)
            // return res.send({trader})

        } catch (err) {
            next(err)
        }
}

// findTraderById controller
// exports.findTraderById = async function(req, res, next) {
//     try {
//         validationHandler(req)
//         let trader = await Trader.findById(req.params.id)
//                                 .select("firstName lastName iban siretNumber country address nameSociety phoneNumber");
//         if(!trader) {
//             return res.status(401).json({message: "Trader not found"})
//         }
//         //trader = await trader.select("firstName, lastName, iban, siretNumber, country, address") // sélectionner les champs qu'on veut retourner
//         return res.send({trader})
//     } catch (err) {
//         next(err)
//     }
// }

// findTraderById controller/method to easily query DB and retrieve a trader
exports.findTraderById = async function(req, res, next, id) {
    try {
        validationHandler(req)
        let trader = await Trader.findById(id)
            .exec((err, trader) => {
                if(err || !trader ) {
                    return res.status(400).json({
                        error: "Trader not found !"
                    })
                }
            req.profile = trader // adds profile object to req with trader info
            next()
        });
    } catch (err) {
        next(err)
    }
}

// getTraderById controller
exports.getTraderById = (req, res) => {
    validationHandler(req)
    return res.send(req.profile)
}

// unregister controller
exports.unregister = async function(req, res, next) {
    validationHandler(req)
    try {
        let trader = req.profile
        await trader.remove((err, deletedTrader) => {
        if(err) {
           return res.status(400).json({
               error: "You don't have authorized to delete a trader."
           })
        }
        return res.send({message: `The account ${deletedTrader.email} was unregistered successfully !`});
    });
    } catch (error) {
        next()
    }
}

//update controller
exports.update = async (req, res, next) => {
    try {
        validationHandler(req)
        let trader = req.profile
        trader = _.extend(trader,  req.body) // change les champs renseignés dans le body de la requête
        trader.updated_at = Date.now()

        trader.country = capitalize(req.body.country)
        let tempStr= trader.country.substring(0, 2)
        trader.codeCountry = tempStr.toUpperCase()

        await trader.save(err => {
            if(err) {
                let error = new Error("Wrong Request ! You don't have permissions to update profile Trader.");
                error.statusCode = 400;
                throw error;
            }
            //return res.status(400).json(err)
        })

        return res.send({trader});

    } catch (err) {
        next(err)
    }
}

// List all Traders
exports.allTraders =  async (req, res, next) => {
    try {
        // Declaring before if not exists "pagination et page" variables
        const pagination = req.query.pagination ? parseInt(req.query.pagination ) : 10;
        const page = req.query.page ? parseInt(req.query.page) : 1;

        // Count the total of posts per page
        const totalOfTraders = await Trader.estimatedDocumentCount()
        const numberOfTradersPerPage = await Trader
            .estimatedDocumentCount()
            .skip((page - 1) * pagination)
            .limit(pagination)

        const traders = await Trader.find((err, traders) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            }
        })
        .skip((page - 1) * pagination)
        .limit(pagination)
        .select('email firstName lastName nameSociety iban phoneNumber')

        return res.json({
                        "page": page,
                        "Traders display on this page": numberOfTradersPerPage ,
                        "Total of traders": totalOfTraders, traders
                    })
    } catch (err) {
        next(err)
    }
}

// hasAuthorized : Permet de vérifier si un commerçant peut exécuter certaines actions sur un endpoint(ou ressource)
exports.hasAuthorized = (req, res, next) => {
    const authorized = req.profile && req.auth && req.profile._id === req.auth._id
    if(!authorized) {
        return res.status(403).json({
            error: "You are not authorized di perform this action."
        })
    }
    next()
}



