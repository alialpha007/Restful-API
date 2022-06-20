const express = require("express")
let router = express.Router()
let { User } = require("../../models/user")
var bcrypt = require('bcryptjs');
const _ = require("lodash")
const jwt = require("jsonwebtoken")
const config = require("config")


// FOR REGISTERING/SIGNUP PROCESS
router.post("/register", async (req, res) => {

    // CHECK IF THE USER ALREADY EXIST
    let user = await User.findOne({ email: req.body.email })
    if (user) return res.status(400).send("email already exist") //IF YES

    // IF NO
    user = new User()
    user.name = req.body.name
    user.email = req.body.email
    user.password = req.body.password
    await user.generateHashedPasswords()

    await user.save()
    return res.send(_.pick(user, ["name", "email"]))
})

//FOR LOGIN PROCESS
router.post("/login", async (req, res) => {

    // CHECK IF MOT USER
    let user = await User.findOne({ email: req.body.email })
    if (!user) return res.status(400).send("User not Registered") //IF NO

    //IF YES
    let isValid = await bcrypt.compare(req.body.password, user.password)
    if (!isValid) return res.status(401).send("Invalid Password")

    // GIVING TOKEN TO THE LOGGED IN USER
    let token = jwt.sign({ _id: user._id, name: user.name }, config.get("jwtPrivateKey"))

    res.send(token)

})

module.exports = router