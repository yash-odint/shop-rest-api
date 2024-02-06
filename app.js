const express = require('express');
const app = express();

// any http request will be accepted
// on default route (localhost:port)
app.use((req, res, next)=>{
    res.status(200).json({
        message : "it works"
    })
});

module.exports = app;