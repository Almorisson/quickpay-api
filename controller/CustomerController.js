/**
 * @file CustmerController.js
 * Controller CustmerController
 * @author : Mor NDIAYE - Lucas CHEN
 * @copyright : 2019 - 2020 All rights reserved
 */
const
    jwt = require('jsonwebtoken'),
    Customer = require('../models/customers'),
    jwt_decode = require('jwt-decode'),
    validationHandler = require('../validations/validationHandler'),
    { capitalize } = require('../helpers'),
    _ = require('lodash'),
    formidable = require('formidable'),
    fs = require('fs')
config = require('../config/index')

// register controller
exports.register = async (req, res, next) => {
    try {

        validationHandler(req);

        const existingCustomer = await Customer.findOne({ email: req.body.email })

        if (existingCustomer) {
            const error = new Error("Email is already in used!")
            error.statusCode = 403;
            throw error;
        }

        let customer = await new Customer();
        customer.firstName = capitalize(req.body.firstName);
        customer.lastName = req.body.lastName.toUpperCase();
        customer.email = req.body.email
        customer.password = await customer.encryptPassword(req.body.password)
        customer.phoneNumber = req.body.phoneNumber // TODO: S'assurer que c'est une numéron de téléphone valable
        customer.city = req.body.city
        customer.postalCode = req.body.postalCode
        customer.address = req.body.address

        if (req.body.country && req.body.country !== "") {
            customer.country = capitalize(req.body.country)
            let tempStr = req.body.country.substring(0, 2)
            customer.codeCountry = tempStr.toUpperCase();
        }

        // if((req.body.phoneNumber).length < 16 && (req.body.phoneNumber).length > 12) {
        //     customer.phoneNumber = req.body.phoneNumber
        // }
        customer.phoneNumber = req.body.phoneNumber
        if (req.body.picture && req.body.picture !== "") {
            customer.picture = req.body.picture
        }
        if (req.body.birthDay && req.body.birthDay !== "") {
            customer.birthDay = req.body.birthDay
        }
        customer.creditCard = req.body.creditCard

        customer = await customer.save();

        const token = jwt.sign({ id: customer.id }, process.env.JWT_SECRET_KEY)
        return res.send({ customer, token })

    } catch (err) {
        console.log(err);
        next(err)
    }
}

// login controller
exports.login = async (req, res, next) => {
    try {
        validationHandler(req);

        const email = req.body.email
        const password = req.body.password

        const customer = await Customer.findOne({ email }).select("+password")
        if (!customer) {
            const error = new Error("Wrong Email")
            error.statusCode = 401;
            throw error;
        }

        const validPassword = await customer.validPassword(password)
        if (!validPassword) {
            const error = new Error("Wrong Password")
            error.statusCode = 401;
            throw error;
        }

        const token = jwt.sign({ id: customer.id }, process.env.JWT_SECRET_KEY)
        res.cookie("tok", token, { expire: new Date() + 99999 })

        return res.send({ customer, token })
    } catch (err) {
        next(err)
    }
}

exports.profile = async function (req, res, next) {
    if (req.headers.token != null) {
        var email = await jwt_decode(req.headers.token).email;
        await customer.findOne({
            email: email
        }, function (err, customer) {
            if (customer)
                return res.send(customer)
            else
                return res.send({ message: "Profile not found." });
        })
    } else {
        //console.log(req.headers);
        return res.send({ message: "Access to profile forbidden ! You need to send the authentication token." }) // avoid to send text in the api
    }
}

// logout controller
exports.logout = async (req, res, next) => {
    try {
        const response = await res.clearCookie("tok")

        if (!response) {
            const error = new Error("Something went wrong when trying to log out you !")
            error.statusCode = 500;
            throw error;
        }

        return res.send({ "message": "Logged out successfully !" });
    } catch (err) {
        next(err)
    }
}

exports.update = async (req, res, next) => {
    try {
        validationHandler(req)
        let customer = req.profile
        customer = _.extend(customer, req.body) // change les champs renseign�s dans le body de la requ�te
        customer.updated_at = Date.now()

        customer.country = capitalize(req.body.country)
        let tempStr = customer.country.substring(0, 2)
        customer.codeCountry = tempStr.toUpperCase()

        await customer.save();
        return res.send({ customer });

    } catch (err) {
        next(err)
    }
}

// findCustomerById method to easily query DB and retrieve a Customer
exports.findCustomerById = async function (req, res, next, id) {
    try {
        validationHandler(req)
        let customer = await Customer.findById(id)
            .sort("created_at")
            .exec((err, customer) => {
                if (err || !customer) {
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
exports.unregister = async function (req, res, next) {
    validationHandler(req)
    try {
        let customer = req.profile
        await customer.remove((err, deletedCustomer) => {
            if (err) {
                return res.status(400).json({
                    error: "You don't have authorized to delete a customer."
                })
            }
            return res.send({ message: `The account ${deletedCustomer.email} was unregistered successfully !` });
        });
    } catch (error) {
        next()
    }
}

// allCustomers controller
// List all Customers
exports.allCustomers = async (req, res, next) => {
    try {
        // Declaring before if not exists "pagination et page" variables
        const pagination = req.query.pagination ? parseInt(req.query.pagination) : 10;
        const page = req.query.page ? parseInt(req.query.page) : 1;

        // Count the total of posts per page
        const totalOfCustomers = await Customer.estimatedDocumentCount()
        const numberOfCustomerPerPage = await Customer
            .estimatedDocumentCount()
            .skip((page - 1) * pagination)
            .limit(pagination)

        const customers = await Customer.find((err, customers) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            }
            return customers;
        })
            .skip((page - 1) * pagination)
            .limit(pagination)
            .select('_id email firstName lastName phoneNumber')
            .sort({ created_at: -1 });

        return res.json({
            "page": page,
            "Customer display on this page": numberOfCustomerPerPage,
            "Total of Customer": totalOfCustomers, customers
        })
    } catch (err) {
        next(err)
    }
}

// addPhoto controller : pas nécessaire, il est possible d'appeler la fonction update à la place

exports.addPhoto = async function (req, res) {
    if (req.headers.token != null) {
        console.log(req.headers);
        let id = jwt_decode(req.headers.token)._id
        await customer.findOne({
            _id: id
        }, function (err, customer) {
            if (req.file) {
                customer.picture = req.file.path
                customer.save();
                res.send(customer);
            }
        })
    } else {
        res.send({ message: "fail" });
    }
}

// customerPhoto controller : Permet d'ajouter une photo lorsque le champ picture est renseigné
exports.customerAddPhoto = (req, res, next) => {
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

// add forgotPassword and resetPassword methods
exports.forgotPassword = (req, res) => {
    if (!req.body) return res.status(400).json({ message: "No request body" });
    if (!req.body.email)
        return res.status(400).json({ message: "No Email in request body" });

    console.log("forgot password finding user with that email");
    const { email } = req.body;
    console.log("signin req.body", email);
    // find the user based on email
    User.findOne({ email }, (err, user) => {
        // if err or no user
        if (err || !user)
            return res.status("401").json({
                error: "User with that email does not exist!"
            });

        // generate a token with user id and secret
        const token = jwt.sign(
            { _id: user._id, iss: "NODEAPI" },
            config.JWT_SECRET_KEY
        );

        // email data
        const emailData = {
            from: "noreply@node-react.com",
            to: email,
            subject: "Password Reset Instructions",
            text: `Please use the following link to reset your password: ${config.CLIENT_URL}/reset-password/${token}`,
            html: `<p>Please use the following link to reset your password:</p><p>${config.CLIENT_URL}/reset-password/${token}</p>`
        };

        return user.updateOne({ resetPasswordLink: token }, (err, success) => {
            if (err) {
                return res.json({ message: err });
            } else {
                sendEmail(emailData);
                return res.status(200).json({
                    message: `Email has been sent to ${email}. Follow the instructions to reset your password.`
                });
            }
        });
    });
};

// to allow user to reset password
// first you will find the user in the database with user's resetPasswordLink
// user model's resetPasswordLink's value must match the token
// if the user's resetPasswordLink(token) matches the incoming req.body.resetPasswordLink(token)
// then we got the right user

exports.resetPassword = (req, res) => {
    const { resetPasswordLink, newPassword } = req.body;

    User.findOne({ resetPasswordLink }, (err, user) => {
        // if err or no user
        if (err || !user)
            return res.status("401").json({
                error: "Invalid Link!"
            });

        const updatedFields = {
            password: newPassword,
            resetPasswordLink: ""
        };

        user = _.extend(user, updatedFields);
        user.updated = Date.now();

        user.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            }
            res.json({
                message: `Great! Now you can login with your new password.`
            });
        });
    });
};
