const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const multer = require("multer");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads/");
    },
    filename: (req, file, cb) => {
        const fileName = new Date().toISOString() + file.originalname;
        cb(null, fileName);
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb)=>{
        if(file.mimetype !== "image/jpeg"){
            cb(null, false);
        } else{
            cb(null, true);
        }
    },
    limits: {
        fileSize: 1 * 1024 * 1024
    }
});

const Product = require("../models/product");
//all routes will be placed after "/products"
//handling "/products/"
router.get("/", (req, res, next) => {
    Product.find().select("price name _id productImage")
    .exec()
    .then((docs) => {
        const response = {
            count: docs.length,
            products: docs.map((doc)=>{
                return {
                    _id: doc._id,
                    name: doc.name,
                    price: doc.price,
                    productImage: doc.productImage,
                    request: {
                        type: "GET",
                        url: "http://localhost:9999/products/"+doc._id
                    }
                }
            })
        }
        res.status(200).json(response);
    })
    .catch((err) => {
        res.status(500).json({
            error: err
        });
    });
});

router.post("/", upload.single("productImage"), (req, res, next) => {
    console.log(req.file);
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    });
    product
        .save()
        .then((result)=>{
            res.status(200).json({
                message: "Product created successfully",
                product: {
                    _id: result._id,
                    name: result.name,
                    price: result.price,
                    request: {
                        type: "GET",
                        url: "http://localhost:9999/products/"+result._id
                    }
                }
            });
        })
        .catch((err)=>{
            console.log(err);
        });

});

//handling "/products/{id}"
router.get("/:productId", (req, res, next)=>{
    const id = req.params.productId;
    Product.findById(id).select("price _id name productImage")
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
    const id = req.params.productId;
    const updateOps = {};
    //[{propName: "name", value: "harry potter"}]
    for(const ops of req.body){
        updateOps[ops.propName] = ops.value; 
    }
    Product.updateOne({_id: id}, { $set: updateOps})
        .exec()
        .then((result)=>{
            const response = {
                message: "Product updated",
                request: {
                    type: "GET",
                    url: "http://localhost:9999/products/"+id
                }
            }
            res.status(200).json(response);
        })
        .catch((err) => {
            res.status(500).json({
                error: err
            })
        });
});

router.delete("/:productId", (req, res, next) => {
    const id = req.params.productId;
    Product.deleteOne({_id:id})
    .exec()
    .then((result) => {
        res.status(200).json({res: result});
    })
    .catch((err) => {
        res.status(500).json({
            error: err
        });
    });
});

module.exports = router;