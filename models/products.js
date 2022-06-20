var mongoose = require("mongoose");
const Joi = require('joi');

var productSchema = mongoose.Schema({
    name: String,
    price: Number
});

var Product = mongoose.model("Product", productSchema);

function validateProduct(data) {
    const schema = Joi.object({
        name: Joi.string().min(1).max(20).required(),
        price: Joi.number().min(0).required(),

    })
    return schema.validate(data, { abortEarly: false })
}

module.exports.Product = Product;
module.exports.validate = validateProduct;