const express = require("express")
let router = express.Router()
var { Product } = require("../../models/product")
const validateProduct = require("../../middlewares/validateProduct")
const auth = require("../../middlewares/auth")
const admin = require("../../middlewares/admin")


//GET ALL RECORDS
router.get("/", async (req, res) => {
    console.log(req.user)

    let page = Number(req.query.page ? req.query.page : 1)
    let perPage = Number(req.query.perPage ? req.query.perPage : 10)
    let skipRecords = perPage * (page - 1)

    let products = await Product.find().skip(skipRecords).limit(perPage)
    return res.send(products)
})

//GET SINGLE RECORD
router.get("/:id", async (req, res) => {

    try {

        let product = await Product.findById(req.params.id)

        // WHEN ID IS CORRECT BUT PRODUCT IS NOT PRESENT IN DB
        if (!product) return res.status(400).send("Product with given ID is not present")

        // WHEN PRODUCT IS PRESENT IN DB
        return res.send(product)

    } catch (error) {

        // WHEN FORMAT OF ID IS INCORRECT
        return res.status(400).send("Invalid ID of Product...")
    }
})

// UPDATE SINGLE RECORD (PUT)
router.put("/:id", auth, admin, validateProduct, async (req, res) => {

    let product = await Product.findById(req.params.id)
    product.name = req.body.name
    product.price = req.body.price
    await product.save()
    return res.send(product)

})

// DELETE SINGLE RECORD
router.delete("/:id", auth, admin, async (req, res) => {

    let product = await Product.findByIdAndDelete(req.params.id)
    return res.send(product)

})

// CREATE A NEW RECORD
router.post("/", auth, admin, validateProduct, async (req, res) => {



    let product = new Product()
    product.name = req.body.name
    product.price = req.body.price
    await product.save()
    return res.send(product)

})


module.exports = router