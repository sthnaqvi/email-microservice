/**
 * Created by Tauseef Naqvi on 09-06-2018.
 */
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../../config');
const utils = require('../../utils');
const Client = require('../../models/clientModel');
const User = require('../../models/userModel');
const cron = require('../../cron');

const login = (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    if (!email)
        return res.status(400).json({success: false, msg: "Email can't be null."});
    if (!password)
        return res.status(400).json({success: false, msg: "Password can't be null."});

    let clientDetails;
    Client.findOne({email})
        .then((client) => {
            if (!client)
                throw Error('NoEmail');
            clientDetails = client;
            return bcrypt.compare(password, client.passwordHash);
        })
        .then((isCorrect) => {
            if (!isCorrect)
                throw Error("InvalidPassword");
            jwt.sign({email: clientDetails.email, clientId: clientDetails._id}, config.secret, (err, token) => {
                if (err)
                    throw err;
                res.json({success: true, token});
            })
        })
        .catch((error) => {
            if (error.message === 'NoEmail')
                return res.status(400).json({success: false, msg: "Email not available in client database."});
            if (error.message === 'InvalidPassword')
                return res.status(401).json({success: false, msg: "Invalid Password."});
            //TODO: send particular error on every error
            console.log(error)
        })
};

const createUser = (req, res) => {
    const authParameters = req.body.tokenData;

    const name = req.body.name;
    const email = req.body.email;
    const offset = req.body.offset;
    const city = req.body.city;
    const country = req.body.country;

    const clientId = authParameters.clientId;

    if (!name)
        return res.status(400).json({success: false, msg: "Name can't be null."});
    if (!email)
        return res.status(400).json({success: false, msg: "Email can't be null."});
    if (!utils.validateEmail(email))
        return res.status(400).json({success: false, msg: "Invalid Email format"});

    let newUser = new User();
    newUser.name = name;
    newUser.email = email;
    newUser.offset = offset;
    newUser.city = city;
    newUser.country = country;
    newUser.clientId = clientId;
    newUser.save()
        .then((user) => {
            cron.findAndUpdateOffset(offset);
            res.json({success: true, msg: "New user created.", user})
        })
        .catch((error) => {
            console.log(error);
            res.json({success: false, msg: "Oops there is an error", error: error.message})
        })
};


//to create client for testing only
const createClient = (client) => {
    let saltRounds = 10;
    bcrypt.hash(client.password, saltRounds)
        .then(function (hash) {
            let newClient = new Client();
            newClient.name = client.name;
            newClient.email = client.email;
            newClient.city = client.city;
            newClient.country = client.country;
            newClient.passwordHash = hash;

            return newClient.save();
        })
        .then((client) => {
            console.log("New client created: ", client);
        })
};

Controller = {
    login,
    createUser,
    createClient
};

module.exports = Controller;