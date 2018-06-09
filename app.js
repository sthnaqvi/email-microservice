/**
 * Created by Tauseef Naqvi on 09-06-2018.
 */
// BASE SETUP
// =============================================================================
// import the packages we need
const express = require('express');                   //import express module
const bodyParser = require('body-parser');            //import bodyparser
let mongoose = require('mongoose');                 //import mongoose
mongoose.Promise = require('bluebird'); // set Promise provider to bluebird
const app = express();                                //import express contractor
const config = require('./config');                   //import config
const utils = require('./utils');
const morgan = require('morgan');

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :date[clf]'));

// configure body parser
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(function (error, req, res, next) {
    //Catch json error
    res.status(400).json({success: false, msg: "Opps there is an error", error: error.message})
});

//Mongoose Setup
// =============================================================================
let checkAndConnectDb = () => {
    // Connect To Database
    mongoose.connect(config.database, function (err) {
        if (err) {
            console.log('Database connect error: ' + err);
        }
    });

    // On Connection
    mongoose.connection.on('connected', () => {
        console.log('Database connected at ' + config.database);
    });

// On Error
    mongoose.connection.on('error', (err) => {
        console.log('Database check connection error: ' + err);
    });

};
checkAndConnectDb();

// ROUTES FOR OUR API
// =============================================================================
// create our router
const router = express.Router();

// middleware to use for all requests
router.use((req, res, next) => {
    //check db is connect and connect if not connected
    if (!utils.isDbConnected(mongoose))
        checkAndConnectDb();

    // do logging
    next();
});

// import our routers
// ----------------------------------------------------
let routers = require('./modules/routers');
router.use(routers);

// register our routers
// -------------------------------
app.use('/api', router);


// START THE SERVER
// =============================================================================
app.listen(config.port, (err) => {
    if (err)
        return console.log(err);
    console.log('Server running at port:' + config.port);
});
