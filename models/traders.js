const bcrypt = require('bcryptjs')
const validator = require("email-validator")
const mongoose = require('mongoose')
const { objectId } = mongoose.Schema

const TraderSchema = mongoose.Schema({
    firstName: {type: String, required:true, capitalize: true, minLength: 2, maxLength: 100},
    lastName: {type: String, required:true, uppercase: true, minLength: 2 ,maxLength: 50},
    nameSociety: {type: String, required: true},
    email: {type: String, required:true, unique: true},
    accountType: {type: String, required: false, default: "trader"},
    password: {type: String, required: true, select: false},
    picture: {
        data: Buffer,
        type: String,
        default: "http://via.placeholder.com/100X100"
    },
    created_at: {type: Date, required: true, default: Date.now()},
    updated_at: {type: Date},
    phoneNumber: {type: String, required: true, unique: true},
    country: {type: String, required: true, default: "France"},
    codeCountry: {type: String, required: false, default: "FR"},
    birthDay: {type: Date, required: false},
    address: {type: String, required: true, unique: true},
    postalCode: {type: String, required: true, min: 5, max: 5},
    city: {type: String, required: true, minLength: 5, maxLength: 255},
    siretNumber: {type: String, required: true, unique: true, min: 10, max: 30},
    iban: {type: String, required: true, max: 34, unique: true},
    resetPasswordLink: {
        data: String,
        default: ""
    }
}, {versionKey: false // You should be aware of the outcome after set to false
})

// Ancienne version des methods de validation
TraderSchema.methods.comparePassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

TraderSchema.methods.validateEmail = function(email) {
    return validator.validate(email);
}

// Nouvelle methodes de validation
TraderSchema.methods.encryptPassword = async password => {
    const salt = await bcrypt.genSalt(5)
    const hash = await bcrypt.hash(password, salt)
    return hash;
};

TraderSchema.methods.validPassword = async function(candidatePassword) {
    const result = bcrypt.compare(candidatePassword, this.password)
    return result;
};

module.exports = mongoose.model('Trader', TraderSchema);
