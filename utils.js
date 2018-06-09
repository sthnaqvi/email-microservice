/**
 * Created by Tauseef Naqvi on 09-06-2018.
 */
const nodemailer = require('nodemailer');

// Checks if the mongoose connection readyState is either 1 (connected) or 2 (connecting)
module.exports.isDbConnected = (dbm) => {
    return dbm.connection['readyState'] === 1;
};
//return error with status code and msg
module.exports.returnError = (err, res) => {
    let status = (err.code === 'NOT_AUTHORIZED') ? 401 : 400;

    res.status(status).json({
        code: err.code,
        message: err.message,
    }).end();
};

//to validate email when client add any user
module.exports.validateEmail = (email) => {
    let regexEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regexEmail.test(email);
};

//send good morning email function
module.exports.sendGoodMorningEmail = (user) => {
    return new Promise((resolve, reject) => {
        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'etest7344@gmail.com',
                pass: 'test@2018'
            }
        });
        let mailOptions = {
            to: user.email,
            subject: 'Good Morning',
            // text: '', // plain text body
            // language=HTML
            html: `<h5>Hi ${user.name},</h5>
                    <h2>Good Morning</h2>`
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, (err, info) => {
            if (err)
                return reject(err);
            resolve(info);
        });
    })
};