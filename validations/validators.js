const { check } = require('express-validator')

exports.isEmail = check('email')
                .isEmail()
                .withMessage("Veuillez renseigner un email valide.")

exports.hasPassword = check('password')
                .exists()
                .withMessage("Le champ mot de passe ne pas être vide.")

exports.hasFirstName = check('firstName')
                .isLength({min : 5})
                .withMessage("The firstName field is required. 5 characters minimum.")

exports.hasLastName = check('lastName')
                .isLength({min : 5})
                .withMessage("The lastName field is required. 5 characters minimum.")
