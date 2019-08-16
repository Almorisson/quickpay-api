const bcrypt = require('bcryptjs')
const validator = require("email-validator")
const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema

const TraderSchema = mongoose.Schema({
    firstName: {type: String, required:true, capitalize: true, minLength: 2, maxLength: 100},
    lastName: {type: String, required:true, uppercase: true, minLength: 2 ,maxLength: 50},
    nameSociety: {type: String, required: true},
    email: {type: String, required:true, unique: true},
    accountType: {type: String, required: false, default: "trader"},
    password: {type: String, required: true, select: false},
    picture: {
        data: Buffer,
        contentType: String
    },
    created_at: {type: Date, required: true, default: Date.now()},
    updated_at: {type: Date},
    phoneNumber: {type: String, required: true, unique: true, minLength: 12, maxLength: 16},
    country: {type: String, required: true, default: "France", minLength: 5, maxLength: 100},
    codeCountry: {type: String, required: false, default: "FR"},
    birthDay: {type: Date, required: false},
    address: {type: String, required: true, unique: true, minLength: 10, maxLength: 200},
    postalCode: {type: String, required: true, min: 5, max: 5},
    city: {type: String, required: true, minLength: 3, maxLength: 50},
    siretNumber: {type: String, required: true, unique: true, min: 10, max: 30},
    iban: {type: String, required: true, minLength: 20, maxLength: 34, unique: true},
    resetPasswordLink: {
        data: String,
        default: ""
    },
    qrCode: {
        data: Buffer,
        contentType: String
    },
    transaction: {type: ObjectId, ref: "Transaction"}
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
