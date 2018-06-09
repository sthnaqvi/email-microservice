/**
 * Created by Tauseef Naqvi on 09-06-2018.
 */
const bcrypt = require('bcrypt');
const utils = require('../../utils');
const Client = require('../../models/clientModel');
const User = require('../../models/userModel');

const login = (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    if (!email)
        return res.status(400).json({success: false, msg: "Email can't be null."});
    if (!password)
        return res.status(400).json({success: false, msg: "Password can't be null."});

    Client.findOne({email})
        .then((client) => {
            if (!client)
                throw Error('NoEmail');
        })
        .catch((error) => {
            if (error.message === 'NoEmail')
                return res.status(400).json({success: false, msg: "Email not available in client database."});
        })
};

const createUser = (req, res) => {
    const authParameters = req.body.tokenData;

    const name = req.body.name;
    const email = req.body.email;
    const timeZone = req.body.timeZone;
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
    newUser.timeZone = timeZone;
    newUser.city = city;
    newUser.country = country;
    newUser.clientId = clientId;
    newUser.save()
        .then((result) => {
            res.json({success: true, msg: "New user created."})
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