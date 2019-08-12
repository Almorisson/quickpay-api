const bcrypt = require('bcrypt');
const validator = require("email-validator");
const mongoose = require('mongoose');

const CustomerSchema = mongoose.Schema({
    firstName: {type: String, required:true, trim: true, capitalize: true, minLength: 2, maxLength: 100},
    lastName: {type: String, required:true, trim: true, uppercase: true, minLength: 2 ,maxLength: 50},
    email: {type: String, required:true, trim: true, unique: true},
    password: {type: String, required:true, select: false},
    accountType: {type: String, required: false, default: "customer"},
    picture: {
        data: Buffer,
        type: String,
        default: "http://via.placeholder.com/100X100"
    },
    created_at: {type: Date, required: true, default: Date.now},
    updated_at: {type: Date},
    phoneNumber: {type: String, required: true, unique: true},
    country: {type: String, required: true, default: "France"},
    codeCountry: {type: String, required: true, default: "FR"},
    birthDay: {type: Date, required: false},
    creditCard: {type: String, required: false, min: 16, max: 20,unique: true, index: true},
    resetPasswordLink: {
        data: String,
        default: ""
    }
}, {versionKey: false // You should be aware of the outcome after set to false
})

// Ancienne version des methods de validation
CustomerSchema.methods.comparePassword = function(pass) {
    return bcrypt.compareSync(pass, this.password);
};

CustomerSchema.methods.validateEmail = function(email) {
    return validator.validate(email);
}

//Nouvelle methodes de validation
CustomerSchema.methods.encryptPassword = async password => {
    const salt = await bcrypt.genSalt(5)
    const hash = await bcrypt.hash(password, salt)
    return hash;
};

CustomerSchema.methods.validPassword = async function(candidatePassword) {
    const result = bcrypt.compare(candidatePassword, this.password);
    return result;
};

module.exports = mongoose.model('Customer', CustomerSchema);
