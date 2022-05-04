const Joi = require('joi');
let UniversalFunctions = require('../Utils/UniversalFunctions');
let Config = require('../Config');
let Controller = require('../Controllers');


module.exports = [
  {
    method: 'POST',
    path: '/user/createAccount',
    handler: async (request, h) => {
      let payloadData = request.payload;
      try {
        const data = await Controller.UserController.createAccount(payloadData);
        return UniversalFunctions.sendSuccess(Config.APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT, data)
      }
      catch (err) {
        console.log("--------", err);
        return UniversalFunctions.sendError(err)
      }
    },
    config: {
      tags: ['api', 'user'],
      validate: {
        payload: Joi.object({
          name: Joi.string().required(),
          email: Joi.string().required(),
          password: Joi.string().required(),
        }),
        failAction: UniversalFunctions.failActionFunction
      },
      plugins: {
        'hapi-swagger': {
          payloadType: 'form',
          responseMessages: Config.APP_CONSTANTS.swaggerDefaultResponseMessages
        }
      }
    }
  },
  {
    method: 'POST',
    path: '/user/login',
    handler: async (request, h) => {
      let payloadData = request.payload;
      try {
        const data = await Controller.UserController.login(payloadData);
        return UniversalFunctions.sendSuccess(Config.APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT, data)
      }
      catch (err) {
        console.log("--------", err);
        return UniversalFunctions.sendError(err)
      }
    },
    config: {
      tags: ['api', 'user'],
      validate: {
        payload: Joi.object({
          email: Joi.string().required(),
          password: Joi.string().required(),
        }),
        failAction: UniversalFunctions.failActionFunction
      },
      plugins: {
        'hapi-swagger': {
          payloadType: 'form',
          responseMessages: Config.APP_CONSTANTS.swaggerDefaultResponseMessages
        }
      }
    }
  },
];


