/**
 * Created by Tauseef Naqvi on 09-06-2018.
 */

const router = require("express").Router();
const config = require('../config');
const utils = require('../utils');
const jwt = require('jsonwebtoken');
const clientCtrl = require('./controllers/clientCtrl');

const getCredentials = (req) => {
    let identity = req.header('Authorization');
    if (!identity) return;
    return {
        auth: identity,
    };
};
const verifyAuth = (req, res, cb) => {
    let credentials = getCredentials(req);
    if (!credentials)
        return utils.returnError({code: 'NOT_AUTHORIZED', message: 'JWT not found'}, res);

    jwt.verify(credentials.auth, config.secret, function (err, decoded) {
        if (err)
            return utils.returnError({code: 'NOT_AUTHORIZED', message: 'Invalid jwt token'}, res);
        cb(decoded);
    });
};

router.route('/login').post(clientCtrl.login);

router.route('/create-user').post(function (req, res) {
    verifyAuth(req, res, function (decode) {
            req.body.tokenData = decode;
        clientCtrl.createUser(req, res);
    })
});
module.exports = router;