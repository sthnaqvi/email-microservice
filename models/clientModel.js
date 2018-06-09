/**
 * Created by Tauseef Naqvi on 09-06-2018.
 */
let mongoose = require('mongoose');
let Schema = mongoose.Schema;

// schema for client
let clientSchema = new Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    city:{type:String},
    country:{type:String}
});

module.exports = mongoose.model('Client', clientSchema);