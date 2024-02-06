const express = require('express');
const router = express.Router();

//all routes will be placed after "/products"
//handling "/products/"
router.get("/", (req, res, next) => {
    res.status(200).json({
        message: "handling GET request to /products"
    });
});
router.post("/", (req, res, next) => {
    res.status(200).json({
        message: "handling POST request to /products"
    });
});

//handling "/products/{id}"
router.get("/:productId", (req, res, next)=>{
    const id = req.params.productId;
    res.status(200).json({
        message: "handling GET request to /products/{id}",
        id: id
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