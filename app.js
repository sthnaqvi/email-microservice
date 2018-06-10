/**
 * Created by Tauseef Naqvi on 09-06-2018.
 */
// BASE SETUP
// =============================================================================
// import the packages we need
const express = require('express');                   //import express module
const bodyParser = require('body-parser');            //import body-parser
const mongoose = require('mongoose');                 //import mongoose
mongoose.Promise = require('bluebird');               // set Promise provider to bluebird
const app = express();                                //import express contractor
const config = require('./config');                   //import config
const utils = require('./utils');
const morgan = require('morgan');

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :date[clf]'));

// configure body parser
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

//database connection
utils.connectDatabase()
    .then(() => {
        console.log('Database connected at ' + config.database);
    })
    .catch((err) => {
        console.log('Database connection error: ' + err);
    });

// ROUTES FOR OUR API
// =============================================================================
// create our router
const router = express.Router();

// middleware to use for all requests
router.use((req, res, next) => {
    //check db connection
    if (!utils.isDbConnected(mongoose)) {
        utils.connectDatabase()
            .then(() => {
                console.log('Reconnect database ');
                next();
            })
            .catch((err) => {
                console.log('Database connection error: ' + err);
            });
    }
    else next();
});

// import our routers
// ----------------------------------------------------
const routers = require('./modules/routers');
router.use('/client', routers);

// register our routers
// -------------------------------
app.use('/api', router);

// create client for testing only
let clientCtrl  = require('./modules/controllers/clientCtrl');
// clientCtrl.createClient({name: "Sam", email: "sam@xyz.com", city: "Dubai", country: "UAE", password: "test123"});

//Run cron
const cron = require('./cron');
//start email cron
cron.startCron();


// START THE SERVER
// =============================================================================
app.listen(config.port, (err) => {
    if (err)
        return console.log(err);
    console.log('Server running at port:' + config.port);
});