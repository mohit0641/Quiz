"use strict";
let userRoute = require("./userRoute");
let quizRoute = require("./quizRoute");

let all = [].concat(
    userRoute,
    quizRoute
);

module.exports = all;
