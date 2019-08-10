/**
 * @file CustmerController.js
 * Controller CustmerController
 * @author : Mor NDIAYE - Lucas CHEN
 * @copyright : 2019 - 2020 All rights reserved
 */

const bcrypt  = require('bcryptjs'),
    jwt     = require('jsonwebtoken'),
    Customer = require('../models/customers'),
    jwt_decode = require('jwt-decode');
const validationHandler = require('../validations/validationHandler')
//const jwt_simple = require('simple-jwt')
//const config = require('../config')
const capitalize = require('../helpers')
const _ = require('lodash')

let mongoose = require('mongoose');

// module.exports = {
//     register: async function(req, res){
//         await customer.findOne({
//                 'email': req.body.email
//             }, function(err, customer) {
//                 if (customer) {
//                     return res.json({message: "Registration failed. The email is already in used !"});
//                 } else {
//                     //var birthdate = req.body.birthDay
//                     const customer = new customer({
//                         _id: new mongoose.Types.ObjectId(),
//                         firstName: req.body.firstName,
//                         lastName: req.body.lastName,
//                         email: req.body.email,
//                         password: bcrypt.hash(req.body.password, 10),
//                         picture: "",
//                         phoneNumber: req.body.phoneNumber
//                     });
//                     if (customer.validateEmail(req.body.email)) {
//                         customer.save().then(result => {
//                             console.log(result);
//                         }).catch(err => console.log(err));
//                         return res.json({
//                             message: "Registration success !",
//                             register: customer
//                         });
//                     } else {
//                         return res.json({
//                             message: "Registration failed. Incorrect email syntax."
//                         })
//                     }
//                 }
//             }
//         )
//     },

//     login: async function(req, res){
//         await customer.findOne({
//                 email:req.body.email
//             }, function(err, customer) {
//                 if (err) {
//                    return res.send(err);
//                 }
//                 if (customer) {
//                     if (!customer.validPassword(req.body.password)) {
//                         return res.status(401).json({message: 'Authentication failed. Invalid password.'}); // avoid to send text in the api
//                     }
//                     return res.json({
//                         login: req.body.email,
//                         message: "Login successful !",
//                         token: jwt.sign({email: customer.email, _id: customer._id}, 'secret')
//                     });
//                 } else {
//                     return res.status(400).json({message: 'Authentication failed. Invalid customername.'});
//                 }
//             }
//         )
//     },

//      // login controller que je propose
//     // login: async function(req, res, next) {
//     //     try {
//     //         validationHandler(req);

//     //         const email = req.body.email
//     //         const password = req.body.password

//     //         const customer = await customer.findOne({email}).select("+password")
//     //         if(!customer) {
//     //             const error = new Error("Wrong Email")
//     //             error.statusCode = 401;
//     //             throw error;
//     //         }

//     //         const validPassword = await customer.validPassword(password)
//     //         if(!validPassword) {
//     //             const error = new Error("Wrong Password")
//     //             error.statusCode = 401;
//     //             throw error;
//     //         }

//     //         const token = jwt_simple.encode({id: customer.id}, config.jwtSecret)

//     //         return res.send({customer, token})

//     //     } catch (err) {
//     //         next(err)
//     //     }
//     // },

//     profile: async function(req, res) {
//         if (req.headers.token != null) {
//             var email = await jwt_decode(req.headers.token).email;
//             await customer.findOne({
//                 email: email
//             }, function(err, customer) {
//                 if (customer)
//                     return res.send(customer)
//                 else
//                     return res.send({message: "Profile not found."});
//             })
//         } else {
//             //console.log(req.headers);
//             return res.send({message: "Access to profile forbidden ! You need to send the authentication token."}) // avoid to send text in the api
//         }
//     },

//     listcustomers: async function(req, res){
//         await customer.find()
//         .select('_id email picture')
//         .exec()
//         .then(function(err, customer){
//             if (err) {
//                 return res.send(err);
//             }
//             return res.json({customer});
//         })
//     },

//     updateProfile: async function(req, res) {
//         if (req.headers.token != null) {
//             let id = await jwt_decode(req.headers.token)._id;
//             await customer.findOne({
//                 _id: id
//             }, function (err, customer) {
//                 if (err)
//                     return res.send(err);
//                 if (req.body.email != null)
//                     customer.email = req.body.email
//                 if (req.body.name != null)
//                     customer.name = req.body.name
//                 if (req.body.admin != null)
//                     customer.admin = req.body.admin
//                 customer.save();
//                 return res.json({token: jwt.sign({email: customer.email, _id: customer._id, admin: customer.admin}, 'secret'),
//                     message: "Update successful !"});
//             })
//         } else {
//             return res.send({message: "Update failed. You need to send the authentication token."});
//         }
//     },

//     updatePassword: async function(req, res) {
//         if (req.headers.token != null) {
//             var email = jwt_decode(req.headers.token)._id;
//             await customer.findOne({
//                 _id: id
//             }, function(err, customer) {
//                 if (customer) {
//                     if (req.body.password == null) {
//                         return res.send({message: "Update password failed. Your current password field is empty."})
//                     } else if (req.body.new_password == null) {
//                         return res.send({message: "Update password failed. Your new password field is empty."})
//                     } else {
//                         if (!customer.comparePassword(req.body.password)) {
//                             return res.status(401).json({message: 'Update password failed. Current password is incorrect.'});
//                         } else {
//                             customer.password = bcrypt.hashSync(req.body.new_password, 10);
//                             customer.save();
//                             return res.json({message: "Update password success !"})
//                         }
//                     }
//                 }
//             })
//         } else {
//             return res.send({message: "Update password failed. You need to send the authentication token."});
//         }
//     },

//     delete: async function(req, res) {
//         if (req.headers.token != null) {
//             var admin = jwt_decode(req.headers.token).admin;
//             var id = jwt_decode(req.headers.token)._id;
//             if (id == req.body.id)
//                 res.send("You cannot delete your own account, go unregister !");
//             if (admin == 1) {
//                 await customer.findOne({
//                     _id: req.body.id
//                 }, function (err, customer) {
//                     if (err)
//                         res.send(err);
//                     if (customer != null) {
//                         customer.remove();
//                         res.send({message: "Delete successful !"})
//                     } else
//                         res.json({message:"Cannot delete. customer not found."});
//                 })
//             } else {
//                 res.send("Deletion failed. You are not admin !")
//             }
//         } else {
//             res.send({message: "Deletion failed. You need to send the authentication token."});
//         }
//     },

//     unregister: async function(req, res) {
//         if (req.headers.token != null) {
//             var id = jwt_decode(req.headers.token)._id
//             await customer.findOne({
//                 _id: id
//             }, function(err, customer) {
//                 if (err)
//                     res.send(err);
//                 if (customer != null) {
//                     customer.remove();
//                     res.send({message: "Unregister successful !"})
//                 } else
//                     res.send({message: "Cannot unregister. This account doesn't exist."})
//             });
//         } else {
//             res.send({message: "Unregistration failed. You need to send the authentication token."});
//         }
//     },

//     addPhoto: async function(req, res) {
//         if (req.headers.token != null) {
//             console.log(req.headers);
//             let id = jwt_decode(req.headers.token)._id
//             await customer.findOne({
//                 _id: id
//             }, function(err, customer) {
//                 if (req.file) {
//                     customer.picture = req.file.path
//                     customer.save();
//                     res.send(customer);
//                     //customer.save();
//                 }
//             })
//         } else {
//             res.send({message: "fail"});
//         }
//             //})
//         //} else {
//         //    res.send({message: "not connected"});
//         //}
//     },

//     transaction: function(req, res) {

//         return stripe.charges.create({
//             amount: req.body.amount,
//             currency: 'eur',
//             source: req.body.token,
//             description: 'Test payment'
//         }).then(resultat => res.status(200).json(resultat));

//     }
// }

/**
 * Nouvelle Version des controllers du fichier CustomerController
 */

// register controller
exports.register = async (req, res, next) => {
    try {

        validationHandler(req);

        const existingCustomer = await Customer.findOne({email: req.body.email})

        if(existingCustomer) {
            const error = new Error("Email is already in used!")
            error.statusCode = 403;
            throw error;
        }

        let customer = await new Customer();
        customer.firstName = capitalize(req.body.firstName)
        customer.lastName = req.body.lastName.toUpperCase()
        customer.email = req.body.email
        customer.password = await customer.encryptPassword(req.body.password)
        customer.phoneNumber = req.body.phoneNumber
        customer.country = req.body.country

        if(req.body.country && req.body.country !== "") {
            customer.country = capitalize(req.body.country)
            let tempStr= req.body.country.substring(0, 2)
            customer.codeCountry = tempStr.toUpperCase()
        }

        if(req.body.picture && req.body.picture !== "") {
            customer.picture = req.body.picture
        }
        if(req.body.birthDay && req.body.birthDay !== "") {
            customer.birthDay = req.body.birthDay
        }
        customer.creditCard = req.body.creditCard

        customer = await customer.save();

        const token = jwt.sign({id: customer.id}, process.env.JWT_SECRET_KEY)
        return res.send({customer, token})

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

        const customer = await Customer.findOne({email}).select("+password")
        if(!customer) {
            const error = new Error("Wrong Email")
            error.statusCode = 401;
            throw error;
        }

        const validPassword = await customer.validPassword(password)
        if(!validPassword) {
            const error = new Error("Wrong Password")
            error.statusCode = 401;
            throw error;
        }

        const token = jwt.sign({id: customer.id}, process.env.JWT_SECRET_KEY)
        res.cookie("tok", token, {expire: new Date() + 99999})

        return res.send({customer, token})
    } catch (err) {
        next(err)
    }
}

exports.profile = async function(req, res, next) {
        if (req.headers.token != null) {
            var email = await jwt_decode(req.headers.token).email;
            await customer.findOne({
                email: email
            }, function(err, customer) {
                if (customer)
                    return res.send(customer)
                else
                    return res.send({message: "Profile not found."});
            })
        } else {
            //console.log(req.headers);
            return res.send({message: "Access to profile forbidden ! You need to send the authentication token."}) // avoid to send text in the api
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
//update controller
exports.update = async (req, res, next) => {
    try {

        validationHandler(req)

        let form = new formidable.IncomingForm();
        // console.log("incoming form data: ", form);
        form.keepExtensions = true;
        form.parse(req, (err, fields, files) => {
            if (err) {
                return res.status(400).json({
                    error: 'Photo could not be uploaded'
                });
            }


            let customer = req.profile
            customer = _.extend(customer,  req.body) // change les champs renseignés dans le body de la requête
            customer.updated_at = Date.now()

            customer.country = capitalize(req.body.country)
            let tempStr= customer.country.substring(0, 2)
            customer.codeCountry = tempStr.toUpperCase()

            if (files.picture) {
                customer.picture.data = fs.readFileSync(files.picture.path);
                customer.picture.contentType = files.picture.type;
            }
            customer.save(err => {
                if(err) {
                    let error = new Error("Wrong Request ! You don't have permissions to update profile Trader.");
                    error.statusCode = 400;
                    throw error;
                }
                //return res.status(400).json(err)
            })

        return res.send({customer});

        });

    } catch (err) {
        next(err)
    }
}

// findCustomerById method to easily query DB and retrieve a Customer
exports.findCustomerById = async function(req, res, next, id) {
    try {
        validationHandler(req)
        let customer = await Customer.findById(id)
            .sort("created_at")
            .exec((err, customer) => {
                if(err || !customer ) {
                    return res.status(400).json({
                        error: "Customer not found !"
                    })
                }
            req.profile = customer // adds profile object to req with Customer info
            next()
        });
    } catch (err) {
        next(err)
    }
}
// unregister controller
exports.unregister = async function(req, res, next) {
    validationHandler(req)
    try {
        let customer = req.profile
        await customer.remove((err, deletedCustomer) => {
        if(err) {
           return res.status(400).json({
               error: "You don't have authorized to delete a customer."
           })
        }
        return res.send({message: `The account ${deletedCustomer.email} was unregistered successfully !`});
    });
    } catch (error) {
        next()
    }
}

// allCustomers controller
// List all Customers
exports.allCustomers =  async (req, res, next) => {
    try {
        // Declaring before if not exists "pagination et page" variables
        const pagination = req.query.pagination ? parseInt(req.query.pagination ) : 10;
        const page = req.query.page ? parseInt(req.query.page) : 1;

        // Count the total of posts per page
        const totalOfCustomer = await Customer.estimatedDocumentCount()
        const numberOfCustomerPerPage = await Customer
            .estimatedDocumentCount()
            .skip((page - 1) * pagination)
            .limit(pagination)

        const customer = await Customer.find((err, Customer) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            }
        })
        .skip((page - 1) * pagination)
        .limit(pagination)
        //.populate("customer").sort({ createdAt: -1})
        .select('email firstName lastName nameSociety iban phoneNumber')

        return res.json({
                        "page": page,
                        "Customer display on this page": numberOfCustomerPerPage ,
                        "Total of Customer": totalOfCustomer, customer
                    })
    } catch (err) {
        next(err)
    }
}

// addPhoto controller : pas nécessaire, il est possible d'appeler la fonction update à la place

exports.addPhoto = async function(req, res) {
        if (req.headers.token != null) {
            console.log(req.headers);
            let id = jwt_decode(req.headers.token)._id
            await customer.findOne({
                _id: id
            }, function(err, customer) {
                if (req.file) {
                    customer.picture = req.file.path
                    customer.save();
                    res.send(customer);
                }
            })
        } else {
            res.send({message: "fail"});
        }
}

// customerPhoto controller : Permet d'ajouter une photo lorsque le champ picture est renseigné
exports.customerPhoto = (req, res, next) => {
    if (req.profile.picture.data) {
        res.set(('Content-Type', req.profile.picture.contentType));
        return res.send(req.profile.picture.data);
    }
    next();
};

// getCustomerById controller
exports.getCustomerById = (req, res) => {
    validationHandler(req)
    return res.send(req.profile)
}
