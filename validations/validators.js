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


exports.passwordResetValidator = (req, res, next) => {
    // check for password
    req.check("newPassword", "Password is required").notEmpty();
    req.check("newPassword")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 chars long")
        .matches(/\d/)
        .withMessage("must contain a number")
        .withMessage("Password must contain a number");

    // check for errors
    const errors = req.validationErrors();
    // if error show the first one as they happen
    if (errors) {
        const firstError = errors.map(error => error.msg)[0];
        return res.status(400).json({ error: firstError });
    }
    // proceed to next middleware or bypass
    next();
};
