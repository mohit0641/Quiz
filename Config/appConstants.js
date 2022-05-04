'use strict';
let SERVER = {
  APP_NAME: 'Charity',
  PORTS: {
    HAPI: 8000
  },
  TOKEN_EXPIRATION_IN_MINUTES: 600,
  JWT_SECRET_KEY: 'UserQuiz',
  GOOGLE_API_KEY: '',
  COUNTRY_CODE: '+91',
  MAX_DISTANCE_RADIUS_TO_SEARCH: '1',
  THUMB_WIDTH: 300,
  THUMB_HEIGHT: 300,
  BASE_DELIVERY_FEE: 25,
  COST_PER_KM: 9, // In USD
  DOMAIN_NAME: 'http://localhost:8000/',

};


let swaggerDefaultResponseMessages = [
  {code: 200, message: 'OK'},
  {code: 400, message: 'Bad Request'},
  {code: 401, message: 'Unauthorized'},
  {code: 404, message: 'Data Not Found'},
  {code: 500, message: 'Internal Server Error'}
];

let STATUS_MSG = {
  ERROR: {
    SOMETHING_WENT_WRONG: {
      statusCode: 400,
      type: 'SOMETHING_WENT_WRONG',
      customMessage: 'Something went wrong on server.'
    },
    DB_ERROR: {
      statusCode: 400,
      customMessage: 'DB Error : ',
      type: 'DB_ERROR'
    },
    DUPLICATE: {
      statusCode: 400,
      customMessage: 'Duplicate Entry',
      type: 'DUPLICATE'
    },
    DUPLICATE_ADDRESS: {
      statusCode: 400,
      customMessage: 'Address Already Exist',
      type: 'DUPLICATE_ADDRESS'
    },
    APP_ERROR: {
      statusCode: 400,
      customMessage: 'Application Error',
      type: 'APP_ERROR'
    },
    INVALID_ID: {
      statusCode: 400,
      customMessage: 'Invalid Id Provided : ',
      type: 'INVALID_ID'
    },
    EMAILID_NOT_VALID: {
      statusCode: 400,
      customMessage: 'Email Id is not valid',
      type: 'EMAILID_NOT_VALID'
    },
    EMAIL_ALREADY_EXIST: {
      statusCode: 400,
      customMessage: 'Email Id is already exist.',
      type: 'EMAIL_ALREADY_EXIST'
    },
    USER_UNREGISTERED_EMAIL: {
      statusCode: 400,
      customMessage: 'Unregistered Email Address',
      type: 'USER_UNREGISTERED_EMAIL'
    },
    USER_INCORRECT_PASSWORD: {
      statusCode: 400,
      customMessage: 'Please enter valid email or Password',
      type: 'USER_INCORRECT_PASSWORD'
    },
    NOT_AUTHORIZED_TO_UPDATE: {
      statusCode: 400,
      customMessage: "You cannot manipulate other user's quiz",
      type: 'NOT_AUTHORIZED_TO_UPDATE'
    },
    IMP_ERROR: {
      statusCode: 500,
      customMessage: 'Implementation Error',
      type: 'IMP_ERROR'
    },
    TOKEN_ALREADY_EXPIRED: {
      statusCode: 401,
      customMessage: 'Sorry, your account has been logged in other device! Please login again to continue',
      type: 'TOKEN_ALREADY_EXPIRED'
    },


  },
  SUCCESS: {
    DEFAULT: {
      statusCode: 200,
      customMessage: "Success",
      type: 'DEFAULT'
    },
  }
};

let DATABASE = {
  USER_ROLES: {
    USER: 'USER',
  },

};


module.exports = {
  swaggerDefaultResponseMessages: swaggerDefaultResponseMessages,
  STATUS_MSG: STATUS_MSG,
  SERVER:SERVER,
  DATABASE:DATABASE

};
