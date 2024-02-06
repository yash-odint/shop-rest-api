const http = require('http');
const app = require('./app');
require("dotenv").config();
PORT = process.env.PORT || 9999;

const server = http.createServer(app);
server.listen(PORT);
