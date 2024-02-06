const express = require('express');
const router = express.Router();

//all routes will be placed after "/orders"
//handling "/orders" routes
router.get("/", (req, res, next)=>{
    res.status(200).json({
        message: "handling GET request to /orders"
    });
});
router.post("/", (req, res, next)=>{
    res.status(200).json({
        message: "handling POST request to /orders"
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