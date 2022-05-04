'use strict';
/**
 * Created by Mohit.
 */
let Config = require('../Config');
let Jwt = require('jsonwebtoken');
let async = require('async');
let Service = require('../Services');
let Mongoose = require('mongoose');
let Models = require('../Models');


let getTokenFromDB = async function (userId, userType, token) {
  let userData = {};
  let flag = false;
  let checkDb,updateAgent,checkAppVersion;
  try {
    await Promise.all([
      checkDb = (async () => {
        let criteria = {_id: userId, accessToken: token};
        if (userType === Config.APP_CONSTANTS.DATABASE.USER_ROLES.USER) {
          const dataAry = await Service.DataServices.getData(Models.user,criteria, {}, {lean: true});
          if (dataAry && dataAry.length > 0) {
            userData = dataAry[0];
            return Promise.resolve(true);
          } else {
            return Promise.reject(Config.APP_CONSTANTS.STATUS_MSG.ERROR.TOKEN_ALREADY_EXPIRED);
          }

        }
        else {
          return Promise.reject(Config.APP_CONSTANTS.STATUS_MSG.ERROR.IMP_ERROR);
        }
      })(),
    ]);
    if (userData && userData._id) {
      userData.id = userData._id;
      userData.type = userType;
      return {userData: userData}
    }
  }
  catch (err) {
    //console.log('===============  Error ============== ', err);
    if (err.statusCode && err.customMessage)
      return Promise.reject(err);
    else {
      return Promise.reject(Config.APP_CONSTANTS.STATUS_MSG.ERROR.SOMETHING_WENT_WRONG);
    }
  }
};

let setTokenInDB = async function (userId, userType, tokenToSave) {
  let data = {};

  let criteria = {
    _id: userId.id
  };

  let setQuery = {
    accessToken: tokenToSave,
  };
  if (userType === Config.APP_CONSTANTS.DATABASE.USER_ROLES.USER) {
    data = await Service.DataServices.updateData(Models.user,criteria, setQuery, {new: true,lean:true})
  }

  if (data && Object.keys(data).length)
    return Promise.resolve(true);
  else
    return Promise.reject(Config.APP_CONSTANTS.STATUS_MSG.ERROR.IMP_ERROR);
};//use

const setToken = async function (tokenData) {
  if (!tokenData.id || !tokenData.type) {
    return Promise.reject(Config.APP_CONSTANTS.STATUS_MSG.ERROR.IMP_ERROR);
  } else {
    let tokenToSend;
    if(tokenData.type === Config.APP_CONSTANTS.DATABASE.USER_ROLES.USER)
      tokenToSend = await Jwt.sign(tokenData, Config.APP_CONSTANTS.SERVER.JWT_SECRET_KEY);
    else
      return Promise.reject(Config.APP_CONSTANTS.STATUS_MSG.ERROR.IMP_ERROR);


    await setTokenInDB(tokenData, tokenData.type, tokenToSend);
    return Promise.resolve({accessToken: tokenToSend});
  }

};


module.exports = {
  setToken: setToken,//use
  getTokenFromDB:getTokenFromDB
};
