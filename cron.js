/**
 * Created by Tauseef Naqvi on 10-06-2018.
 */
const schedule = require('node-schedule');
const User = require('./models/userModel');
const utils = require('./utils');

//convert 8:00 AM of a particular time zone to localtime
const otherTimeToLocalTime = (offset) => {
        let timeInMin = 480; //convert 8:00 AM to minutes
        let now = new Date();
        //get local offset
        let localOffset = -now.getTimezoneOffset();
        //difference between local and other offset
        let diffOffset =  offset - localOffset;
        //add offset with times
        let timeInMinLocal = timeInMin + diffOffset;
        let hours = parseInt(timeInMinLocal / 60);
        if (hours >= 24)
            hours %= 24;
        if (hours < 0)
            hours += 24;
        let minutes = parseInt(timeInMinLocal % 60);
        if (hours === 0 && minutes < 0)
            hours = 24;
        if (minutes < 0){
            minutes += 60;
            hours--
        }
        return {hours, minutes}
    };

//test
console.log(otherTimeToLocalTime(-220));
