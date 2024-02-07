const express = require('express');
const app = express();
const morgan = require("morgan");


const productRoutes = require("./api/routes/products");
const orderRoutes = require("./api/routes/orders");

app.use(morgan('dev'));

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