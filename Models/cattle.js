let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let Config = require('../Config');

let cattle = new mongoose.Schema({
    name: {type: String, required: true,index:true},
    species: {type: String},
    weight: {type: Number},
    length: {type: Number},
    latlong:{type: [Number], index: '2dsphere'},
    createdAt: {type: Date, default: Date.now()},
    isDeleted: {type: Boolean, default: false, required: true},
    isActive: {type: Boolean, default: false, required: true},
    originalURL: {type: String},
    resizedURL: {type: String},

});
cattle.index({"latlong": "2dsphere"});

module.exports = mongoose.model('cattle', cattle);