const express = require('express');
const app = express();
const morgan = require("morgan");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");

const productRoutes = require("./api/routes/products");
const orderRoutes = require("./api/routes/orders");

mongoose.connect(
    "mongodb+srv://yashodint:<password>@shop-rest-api.8n3no4v.mongodb.net/?retryWrites=true&w=majority",
    {
        useMongoClient: true
    }
);

// http request logger
app.use(morgan('dev'));

app.use(bodyparser.urlencoded({extended: false}));
app.use(bodyparser.json());

//routes handle
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);

//error catch
app.use((req, res, next) => {
    const error = Error("Not found");
    error.status = 404;
    next(error);
});
//error handling
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error : {
            message: error.message
        }
    });
});



module.exports = app;