const express = require('express');
const app = express();

const productRoutes = require("./api/routes/products");
app.use("/products", productRoutes);

const orderRoutes = require("./api/routes/orders");
app.use("/orders", orderRoutes);

module.exports = app;