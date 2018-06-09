/**
 * Created by Tauseef Naqvi on 09-06-2018.
 */
let mongoose = require('mongoose');
let Schema = mongoose.Schema;

// schema for user
let userSchema = new Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique:true},
    //store timezone in minutes (eg india(IST) timezone is +5:30  = +330
    timeZone: {type: Number, required: true},
    //to identify client of the user
    clientId:{type: Schema.Types.ObjectId, ref: 'Client'},
    city:{type:String},
    country:{type:String}
});

module.exports = mongoose.model('User', userSchema);