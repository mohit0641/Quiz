'use strict';
var TokenManager = require('../Lib/TokenManager');
var UniversalFunctions = require('../Utils/UniversalFunctions');
let Boom = require('@hapi/boom');
let Config = require('../Config');

exports.register = async function (server, options) {

  await server.register(require('hapi-auth-jwt2'));
  server.auth.strategy("UserAuth", 'jwt',
      {
        key: Config.APP_CONSTANTS.SERVER.JWT_SECRET_KEY,
        validate: async (decoded, request, h) => {
          try {
            const response = await TokenManager.getTokenFromDB(decoded.id, decoded.type, request.auth.token);
            if ((!response || !response.userData)) {
              throw Boom.unauthorized(Config.APP_CONSTANTS.STATUS_MSG.ERROR.TOKEN_ALREADY_EXPIRED.customMessage)
            }
            else {
              return {isValid: true, credentials: {userData: response.userData}};
            }
          }
          catch (err) {
            if (err.statusCode === 401)
              throw Boom.unauthorized(Config.APP_CONSTANTS.STATUS_MSG.ERROR.TOKEN_ALREADY_EXPIRED.customMessage);
            else if (err.statusCode)
              throw Boom.badImplementation(err.customMessage);
            else
              throw err
          }

        },
        verifyOptions: {ignoreExpiration: true, algorithms: ['HS256']}, // pick a strong algorithm
        errorFunc: function (errorContext) {
          let result = errorContext;
          if (errorContext.errorType === 'unauthorized') {
            result.message = UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.TOKEN_ALREADY_EXPIRED.customMessage;
          }

          return result
        }

      }
  );

};

exports.name = 'auth-token-plugin';
