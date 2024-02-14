const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const Order = require("../models/order");
const Product = require("../models/product");

//all routes will be placed after "/orders"
//handling "/orders" routes
router.get("/", (req, res, next)=>{
    Order.find().select("_id quantity product")
        .exec()
        .then((docs) => {
            res.status(201).json({
                count: docs.length,
                orders: docs.map((doc) => {
                    return {
                        _id: doc._id,
                    product: doc.product,
                    quantity: doc.quantity,
                    request: {
                                type: "GET",
                                url: "http:localhost:9999/orders/"+doc._id
                        }
                    }
                })
            });
        })
        .catch((err) => {
            res.status.json({
                error: err
            });
        });
});
router.post("/", (req, res, next)=>{
    //validating product
    Product.findById(req.body.productId)
        .exec()
        .then((prod) => {
            if(!prod){
                res.status(500).json({
                    message: "Product not found"
                });
                return prod;
            }
            const order = new Order({
                _id: new mongoose.Types.ObjectId(),
                quantity: req.body.quantity,
                product: req.body.productId
            });
            return order.save()
        })

        .then((result)=>{
            if(!result){
                return;
            }
            res.status(201).json({
                message: "order stored successfully",
                createdOrder: result,
                request: {
                    type: "GET",
                    url: "http:localhost:9999/orders/"+result._id
                }
            });
        })

        .catch((err) => {
            res.status(500).json({
                error: err
            });
        });
});

// handling "/orders/{id}" routes
router.get("/:orderId", (req, res, next)=>{
    const id = req.params.orderId;
    res.status(200).json({
        message: "handling GET request to /orders/{id}",
        orderId: id
    });
});
router.delete("/:orderId", (req, res, next)=>{
    res.status(200).json({
        message: "order deleted"
    });
});

module.exports = router;