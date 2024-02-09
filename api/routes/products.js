const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");

const Product = require("../models/product");
//all routes will be placed after "/products"
//handling "/products/"
router.get("/", (req, res, next) => {
    res.status(200).json({
        message: "handling GET request to /products"
    });
});
router.post("/", (req, res, next) => {
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    });
    product
        .save()
        .then((result)=>{
            console.log(result);
            res.status(200).json({
                message: "handling POST request to /products",
                product: product
            });
        })
        .catch((err)=>{
            console.log(err);
        });

});

//handling "/products/{id}"
router.get("/:productId", (req, res, next)=>{
    const id = req.params.productId;
    Product.findById(id)
        .exec()
        .then((doc)=>{
            if(doc){
                res.status(200).json(doc);
            } else{
                res.status(404).json(
                    {message : "no valid entry"}
                );
            }
        })
        .catch((err)=>{
            res.status(500).json({
                "error": err
            });
        });
});

router.patch("/:productId", (req, res, next) => {
    res.status(200).json({
        message: "product updated"
    });
});

router.delete("/:productId", (req, res, next) => {
    res.status(200).json({
        message: "product deleted"
    });
});

module.exports = router;