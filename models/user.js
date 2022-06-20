var mongoose = require("mongoose");
const Joi = require('joi');
var bcrypt = require('bcryptjs');

var userSchema = mongoose.Schema({
    name: String,
    email: String,
    password: String,
    role: {
        type: String,
        default: "user",
    }


});

userSchema.methods.generateHashedPasswords = async function () {
    //ENCRYPT A PASSWORD
    let salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
}

var User = mongoose.model("User", userSchema);


// VALIDATION FOR SIGNUP PROCESS
function validateUser(data) {
    const schema = Joi.object({
        name: Joi.string().min(1).max(20).required(),
        email: Joi.string().email().min(1).max(20).required(),
        password: Joi.string().min(8).max(20).required(),

    })
    return schema.validate(data, { abortEarly: false })
}

// VALIDATION FOR LOGIN PROCESS
function validateUserLogin(data) {
    const schema = Joi.object({
        email: Joi.string().email().min(1).max(20).required(),
        password: Joi.string().min(8).max(20).required(),
    })
    return schema.validate(data, { abortEarly: false })
}

module.exports.User = User;
module.exports.validate = validateUser; //SIGNUP
module.exports.validateUserLogin = validateUserLogin; //LOGIN