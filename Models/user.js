let mongoose = require('mongoose');
/*let Schema = mongoose.Schema;
let Config = require('../Config');*/

let user = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    isDeleted: {type: Boolean, default: false, required: true},
    isActive: {type: Boolean, default: false, required: true},
    accessToken: {type:String}
},{ timestamps: true });

module.exports = mongoose.model('user', user);