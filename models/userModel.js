/**
 * Created by Tauseef Naqvi on 09-06-2018.
 */
let mongoose = require('mongoose');
let Schema = mongoose.Schema;

// schema for user
let userSchema = new Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique:true},
    //UTC offset in minutes (eg: India UTC offset is +5:30 hr  = +330 min , Brazil -2:00 = -180 min)
    offset: {type: Number, required: true},
    //to identify client of the user
    clientId:{type: Schema.Types.ObjectId, ref: 'Client'},
    city:{type:String},
    country:{type:String}
});

module.exports = mongoose.model('User', userSchema);