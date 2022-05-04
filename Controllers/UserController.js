let Service = require('../Services');
let UniversalFunctions = require('../Utils/UniversalFunctions');
let async = require('async');
let Config = require('../Config');
let Models = require('../Models');
let md5 = require('md5');
let moment = require('moment');
let Mongoose = require('mongoose');
let _ = require('lodash');
let validator = require("email-validator");
let TokenManager = require('../Lib/TokenManager');


const createAccount = async (payloadData) =>{
  try {
    let {name, email, password} = payloadData;
    let finalData
    await Promise.all([
      validEmail = (async () => {
        let value = await validator.validate(email);
        if (!value) {
          return Promise.reject(Config.APP_CONSTANTS.STATUS_MSG.ERROR.EMAILID_NOT_VALID)
        }
      })(),
      checkEmail = (async () => {
        let criteria = {email: email.toLowerCase(),};
        let data = await Service.DataServices.getData(Models.user, criteria, {}, {lean: true});

        if (data.length > 0) {
          return Promise.reject(Config.APP_CONSTANTS.STATUS_MSG.ERROR.EMAIL_ALREADY_EXIST)
        }

      })(await validEmail),
      insertData = (async () => {
        let obj = {
          name: name,
          email: email,
          password: md5(password)
        };
        let data = await Service.DataServices.createData(Models.user, obj);
        finalData = data
        return data
      })(await checkEmail),
      genrateToken = (async (args) => {
        let tokenData = {
          id: args._id,
          type: Config.APP_CONSTANTS.DATABASE.USER_ROLES.USER,
          iat:new Date().getTime()
        };
        let token = await TokenManager.setToken(tokenData);
        finalData.accessToken = token.accessToken;
      })(await insertData),


    ]);


    return finalData;
  }
  catch (err) {
    console.log('===============  Error ============== ', err);
    if (err.statusCode && err.customMessage)
      return Promise.reject(err);
    else {
      return Promise.reject(Config.APP_CONSTANTS.STATUS_MSG.ERROR.SOMETHING_WENT_WRONG);
    }
  }
};


const login = async (payloadData)=>{
  let {email, password} = payloadData;
  let finalData;
  try {

    let value = await validator.validate(email);
    if (!value) {
      return Promise.reject(Config.APP_CONSTANTS.STATUS_MSG.ERROR.EMAILID_NOT_VALID)
    }

    let criteria = {
      email: email.toLowerCase(),
    };
    let data = await Service.DataServices.getData(Models.user, criteria, {}, {lean: true});
    if (!data || !data.length) {
      return Promise.reject(Config.APP_CONSTANTS.STATUS_MSG.ERROR.USER_UNREGISTERED_EMAIL)
    }
    else if (data[0].password !== md5(password)) {
      return Promise.reject(Config.APP_CONSTANTS.STATUS_MSG.ERROR.USER_INCORRECT_PASSWORD)
    }

    let tokenData = {
      id: data[0]._id,
      type: Config.APP_CONSTANTS.DATABASE.USER_ROLES.USER,
      iat:new Date().getTime()
    };
    let token = await TokenManager.setToken(tokenData);
    data[0].accessToken = token.accessToken;

    return data[0]
  }
  catch (err) {
    console.log('===============  Error ============== ', err);
    if (err.statusCode && err.customMessage)
      return Promise.reject(err);
    else {
      return Promise.reject(Config.APP_CONSTANTS.STATUS_MSG.ERROR.SOMETHING_WENT_WRONG);
    }
  }

};

module.exports = {
  createAccount: createAccount,
  login:login
};