'use strict';

let Models = require('../Models');
let mongoose = require('mongoose');


//Get user_tokens from DB
let getData = function (Model,criteria, projection, options, callback) {
     // console.log('---dddd-----',Model,criteria,projection)
    return Model.find(criteria, projection, options, callback);


};

//Insert user_tokens in DB
let createData = function (Model,objToSave, callback) {
    return new Model(objToSave).save(callback)
};


let updateMultipleData = function (Model,criteria, dataToSet, options, callback) {
    return Model.updateMany(criteria, dataToSet, options, callback);
};

let dataCount = function (Model,criteria, callback) {

    return Model.count(criteria);
};

module.exports = {
    getData: getData,
    updateMultipleData:updateMultipleData,
    createData:createData,
    dataCount:dataCount
};




