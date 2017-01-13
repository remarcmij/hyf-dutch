'use strict';
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const PORT = 8080;
let app = null;

run();

function run() {
    try {
        setupExpress();
        setupApiEndPointRoutes();
        setupStaticRoutes();
        startServer();
    }
    catch (err) {
        console.log(err);
        process.exit();
    }
}

function setupExpress() {
    app = express();
    app.use(bodyParser.json());
}

function setupApiEndPointRoutes() {
}

function setupStaticRoutes() {
    app.get('/', sendIndexHtml);
    app.use(express.static(path.resolve(__dirname, '../../public')));
    app.use(express.static(path.resolve(__dirname, '../../build')));
}

function startServer() {
    app.listen(PORT, err => {
        if (err) {
            throw err;
        }
        console.log('server listening at port ' + PORT);
    });
}

// Request handlers

function sendIndexHtml(req, res) {
    res.sendFile(path.resolve(__dirname, '../../public/index.html'));
}


// module.exports = {
//     dbname: dbname
// }