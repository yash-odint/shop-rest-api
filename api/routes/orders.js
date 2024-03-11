const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const Order = require("../models/order");
const Product = require("../models/product");
const check_auth = require("../middleware/check-auth");

const redis = require("redis");
const redisClient = redis.createClient(6379);
redisClient.connect().then();
function orderCacher(req, res, next){
    redisClient.get("cachedOrder").then((data)=>{
        if(data === null){
            next();
        } else{
            res.json(JSON.parse(data));
            console.log("cached");
        }
    });
}

//all routes will be placed after "/orders"
//handling "/orders" routes
router.get("/", check_auth, orderCacher,(req, res, next)=>{
    Order.find().select("_id quantity product")
        .populate("product", "_id name price")
        .exec()
        .then((docs) => {
            const data = {
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
            }
        redisClient.set("cachedOrder", JSON.stringify(data), {EX: 15});
        res.status(201).json(data);
        })
        .catch((err) => {
            res.status(500).json({
                error: err
            });
        });
});
router.post("/", check_auth, (req, res, next)=>{
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
router.get("/:orderId", check_auth, (req, res, next)=>{
    const id = req.params.orderId;
    Order.findById(id)
        .then((result) => {
            if(!result){
                return res.status(201).json({
                    message: "Order not found"
                });
            }
            const response = {
                _id: result._id,
                product: result.product,
                quantity: result.quantity
            }
            res.status(201).json(response);
        })
        .catch((err) => {
            res.status(500).json({
                error: err
            });
        });
});
router.delete("/:orderId", check_auth, (req, res, next)=>{
    id = req.params.orderId;
    Order.deleteOne({_id: id})
        .exec()
        .then((result) => {
            res.status(200).json({
                message: "order deleted!"
            });
        })
        .catch();
});

module.exports = router;