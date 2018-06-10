/**
 * Created by Tauseef Naqvi on 10-06-2018.
 */
const schedule = require('node-schedule');
const User = require('./models/userModel');
const utils = require('./utils');

// already scheduled offset
let scheduledOffset = {};

//convert 8:00 AM of a particular time zone to localtime
const otherTimeToLocalTime = (offset) => {
    let timeInMin = 480; //convert 8:00 AM to minutes
    let now = new Date();
    //get local offset
    let localOffset = -now.getTimezoneOffset();
    //difference between local and other offset
    let diffOffset = offset - localOffset;
    //add offset with times
    let timeInMinLocal = timeInMin + diffOffset;
    let hour = parseInt(timeInMinLocal / 60);
    if (hour >= 24)
        hour %= 24;
    if (hour < 0)
        hour += 24;
    let minute = parseInt(timeInMinLocal % 60);
    if (hour === 0 && minute < 0)
        hour = 24;
    if (minute < 0) {
        minute += 60;
        hour--
    }
    return {hour, minute}
};

//find user and send mail in batch with limit of 100 user
const findUsersAndSendEmail = (offset) => {
    let skip = 0;
    let limit = 100;
    const findUsers = () => {
        User.find({offset}).skip(skip).limit(limit)
            .then((users) => {
                if (users.length) {
                    users.forEach(function (user) {
                        utils.sendGoodMorningEmail(user)
                    });
                    skip += limit;
                    findUsers()
                }
            })
            .catch(console.log)
    };
    findUsers();
};

//schedule job for a 8:00AM of a particular timezone in local time
const scheduleJob = (offset) => {

    //set scheduled offset true
    scheduledOffset[offset] = true;
    //to convert 8:00AM of a particular timezone in local
    let time = otherTimeToLocalTime(offset);

    let rule = new schedule.RecurrenceRule();
    rule.hour = time.hour;
    rule.minute = time.minute;
    //
    schedule.scheduleJob(rule, function () {
        //find user of a particular timezone and send email
        findUsersAndSendEmail(offset);
    });
};

//to find total unique offsets in user collection
User.distinct('offset')
    .then((offsets) => {
        offsets.forEach((offset) => {
            //scheduleJob for every timezone
            scheduleJob(offset);
        })
    })
    .catch(console.log);

//check offset is scheduled of not if not scheduled then add new offset
module.exports.findAndUpdateOffset = (offset) => {
    if (!scheduledOffset[offset]) {
        scheduleJob(offset)
    }
};