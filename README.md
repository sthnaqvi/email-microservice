# email-microservice
send email to all the users at specific time according to different time zones of the users

Using Express, Mongoose, node-schedule and nodemailer
## Clone repository

    git clone https://github.com/sthnaqvi/email-microservice

After repository is cloned, go inside of repository directory and install dependencies there:

    cd email-microservice
    npm install

To start the server

    npm start
    
## API routes

1. Create a new client:
_uncomment `clientCtrl.createClient()` function in app.js file_

        clientCtrl.createClient({name: "Sam", email: "sam@xyz.com", city: "Dubai", country: "UAE", password: "test123"});
        
2. Login API for client to get Authorization Token:

        POST: http://localhost:9000/api/client/login
    Request:
       
        {
        	"email":"david@xyz.com",
        	"password":"test123"
        }
        
     Response:
     
        {
            "success": true,
            "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRhdmlkQHh5ei5jb20iLCJjbGllbnRJZCI6IjViMWM0NmRjYWRjYzMwNDg0NjU1Mzg3NiIsImlhdCI6MTUyODY1ODIyOH0.SBTyeyAKbwmppf8Q9WJ5vHWQNQNRY0P7DaxO9lYW0Pk"
        }
        
3. Create User API for client to create a new user:
    Request: with `Authorization` Header(JWT)
    
        {
        	"name":"demo",
        	"email":"demo@xyz.com",
        	"offset":"-300",
        	"city":"Lima",
        	"country":"Peru"
        }
        
     Response:
     
        {
            "success": true,
            "msg": "New user created.",
            "user": {
                "_id": "5b1d8699b05dec1cf3900aca",
                "name": "demo",
                "email": "demo@xyz.com",
                "offset": -300,
                "city": "Lima",
                "country": "Peru",
                "clientId": "5b1c46dcadcc304846553876",
                "__v": 0
            }
        }
        
# How it works

After run `npm start` start script run `node app.js`
1. in app.js file called `cron.startCron()` function.
2. in cron.js file `startCron()` function find total number of unique offset(time zone) in database.
3. after getting all existing offsets in Array[] call `scheduleJob()` for each offset.
4. in `scheduleJob()` 
    1. set key value of `scheduledOffset[offset] = true;` to store running offset(timezone) cron.
    2. call `otherTimeToLocalTime(offset);` to get time hour & minute (8:00AM of particular time zone to local time).
    3.  call `schedule.scheduleJob(rule, function (){ })` (function of node-schedule package) to schedule job.
        1.  when cron execute call `findUsersAndSendEmail()` function to find users of particular time zone and send Email in batch 100 users.

## Accounts
   1. Database: Mongodb(create a test account on MLab)
   2. SMTP: GMAIL test account 