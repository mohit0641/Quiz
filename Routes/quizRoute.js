const Joi = require('joi');
let UniversalFunctions = require('../Utils/UniversalFunctions');
let Config = require('../Config');
let Controller = require('../Controllers');

module.exports = [
  {
    method: 'POST',
    path: '/quiz/createQuiz',
    handler: async (request, h) => {
      let userData = await request.auth && request.auth.credentials && request.auth.credentials.userData;
      let payloadData = request.payload;
      try {
        const data = await Controller.QuizController.createQuiz(userData,payloadData);
        return UniversalFunctions.sendSuccess(Config.APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT, data)
      }
      catch (err) {
        console.log("--------", err);
        return UniversalFunctions.sendError(err)
      }
    },
    config: {
      tags: ['api', 'quiz'],
      auth: 'UserAuth',
      validate: {
        payload: Joi.object({
         // createdBy: Joi.string().required(),
          description: Joi.string().required(),
          questions:Joi.array().items(
              Joi.object({
                questionName:Joi.string().required(),
                answers:Joi.array().items(
                    Joi.object({
                      text:Joi.string().required(),
                      isCorrect:Joi.boolean().required()
                    })
                ).min(1).required(),
              })
          ).required().min(1)
        }),
        headers:UniversalFunctions.authorizationHeaderObj,
        failAction: UniversalFunctions.failActionFunction
      },
      plugins: {
        'hapi-swagger': {
         // payloadType: 'form',
          responseMessages: Config.APP_CONSTANTS.swaggerDefaultResponseMessages
        }
      }
    }
  },
  {
    method: 'POST',
    path: '/quiz/editQuiz',
    handler: async (request, h) => {
      let userData = await request.auth && request.auth.credentials && request.auth.credentials.userData;
      let payloadData = request.payload;
      try {
        const data = await Controller.QuizController.editQuiz(userData,payloadData);
        return UniversalFunctions.sendSuccess(Config.APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT, data)
      }
      catch (err) {
        console.log("--------", err);
        return UniversalFunctions.sendError(err)
      }
    },
    config: {
      tags: ['api', 'quiz'],
      auth: 'UserAuth',
      validate: {
        payload: Joi.object({
          quizId: Joi.string().required(),
          //createdBy: Joi.string().required(),
          description: Joi.string().required(),
          questions:Joi.array().items(
              Joi.object({
                questionName:Joi.string().required(),
                answers:Joi.array().items(
                    Joi.object({
                      text:Joi.string().required(),
                      isCorrect:Joi.boolean().required()
                    })
                ).min(1).required(),
              })
          ).required().min(1)
        }),
        headers:UniversalFunctions.authorizationHeaderObj,
        failAction: UniversalFunctions.failActionFunction
      },
      plugins: {
        'hapi-swagger': {
         // payloadType: 'form',
          responseMessages: Config.APP_CONSTANTS.swaggerDefaultResponseMessages
        }
      }
    }
  },
  {
    method: 'GET',
    path: '/quiz/quizList',
    handler: async (request, h) => {
      let userData = await request.auth && request.auth.credentials && request.auth.credentials.userData;
      let payloadData = request.query;
      try {
        const data = await Controller.QuizController.quizList(userData,payloadData);
        return UniversalFunctions.sendSuccess(Config.APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT, data)
      }
      catch (err) {
        console.log("--------", err);
        return UniversalFunctions.sendError(err)
      }
    },
    config: {
      tags: ['api', 'quiz'],
      auth: 'UserAuth',
      validate: {
        query: Joi.object({
          skip:Joi.number().required(),
          limit:Joi.number().required(),

        }),
        headers:UniversalFunctions.authorizationHeaderObj,
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
    path: '/quiz/attemptQuiz',
    handler: async (request, h) => {
      let userData = await request.auth && request.auth.credentials && request.auth.credentials.userData;
      let payloadData = request.payload;
      try {
        const data = await Controller.QuizController.attemptQuiz(userData,payloadData);
        return UniversalFunctions.sendSuccess(Config.APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT, data)
      }
      catch (err) {
        console.log("--------", err);
        return UniversalFunctions.sendError(err)
      }
    },
    config: {
      tags: ['api', 'quiz'],
      auth: 'UserAuth',
      validate: {
        payload: Joi.object({
          quizId: Joi.string().required(),
         // attemptBy: Joi.string().required(),
          description: Joi.string().required(),
          questions:Joi.array().items(
              Joi.object({
                questionName:Joi.string().required(),
                answers:Joi.array().items(
                    Joi.object({
                      text:Joi.string().required(),
                      isCorrect:Joi.boolean().required(),
                      isSelected:Joi.boolean().required(),
                    })
                ).min(1).required(),
              })
          ).required().min(1)
        }),
        headers:UniversalFunctions.authorizationHeaderObj,
        failAction: UniversalFunctions.failActionFunction
      },
      plugins: {
        'hapi-swagger': {
         // payloadType: 'form',
          responseMessages: Config.APP_CONSTANTS.swaggerDefaultResponseMessages
        }
      }
    }
  },
  {
    method: 'GET',
    path: '/quiz/basicStats',
    handler: async (request, h) => {
      let userData = await request.auth && request.auth.credentials && request.auth.credentials.userData;
      try {
        const data = await Controller.QuizController.basicStats(userData);
        return UniversalFunctions.sendSuccess(Config.APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT, data)
      }
      catch (err) {
        console.log("--------", err);
        return UniversalFunctions.sendError(err)
      }
    },
    config: {
      tags: ['api', 'quiz'],
      auth: 'UserAuth',
      validate: {
        headers:UniversalFunctions.authorizationHeaderObj,
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
    method: 'GET',
    path: '/quiz/quizAttempts',
    handler: async (request, h) => {
      let userData = await request.auth && request.auth.credentials && request.auth.credentials.userData;
      let payloadData = request.query;
      try {
        const data = await Controller.QuizController.quizAttempts(userData,payloadData);
        return UniversalFunctions.sendSuccess(Config.APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT, data)
      }
      catch (err) {
        console.log("--------", err);
        return UniversalFunctions.sendError(err)
      }
    },
    config: {
      tags: ['api', 'quiz'],
      auth: 'UserAuth',
      validate: {
        query: Joi.object({
          quizId:Joi.string().required(),
        }),
        headers:UniversalFunctions.authorizationHeaderObj,
        failAction: UniversalFunctions.failActionFunction
      },
      plugins: {
        'hapi-swagger': {
          payloadType: 'form',
          responseMessages: Config.APP_CONSTANTS.swaggerDefaultResponseMessages
        }
      }
    }
  }
];