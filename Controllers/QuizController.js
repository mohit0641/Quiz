let Service = require('../Services');
let UniversalFunctions = require('../Utils/UniversalFunctions');
let async = require('async');
let Config = require('../Config');
let Models = require('../Models');
let md5 = require('md5');
let moment = require('moment');
let Mongoose = require('mongoose');
let _ = require('lodash');


const createQuiz = async(userData,payloadData)=> {
  try{
    let {createdBy,description,questions} = payloadData;
    let {id} = userData;

    await Promise.all([
        createData = (async ()=>{
          let obj ={
            createdBy:id,
            description:description,
            questions:questions
          };
          const data = await Service.DataServices.createData(Models.quiz,obj);
          return data;
        })(),
        /*addQuestions = (async (args) =>{
          let quizId = args._id;
          for(let i=0;i<questions.length;i++){
            let obj = {
              quizId:quizId,
              description:questions[i].description,
              answers:questions[i].answers,
            };
            const data = await Service.DataServices(Models.questions,obj);
          }

        })(await createData)*/
    ]);
    return {};
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

const editQuiz = async (userData,payloadData) => {
  try{
    let {quizId,description,questions} = payloadData;
    let {id} = userData;

    await Promise.all([
        checkQuizTemplate = (async () =>{
          const data = await Service.DataServices.getData(Models.quiz,{createdBy:id,_id:quizId},{_id:1},{lean:true});
          if(data.length === 0){
            return Promise.reject(Config.APP_CONSTANTS.STATUS_MSG.ERROR.NOT_AUTHORIZED_TO_UPDATE);
          }
        })(),
        updateQuiz = (async () =>{
          let cri = {_id:quizId};
          let dataToUpdate ={
            description:description,
            questions:questions
          };
          const data = await Service.DataServices.updateData(Models.quiz,cri,dataToUpdate,{new:true});
        })(await checkQuizTemplate)
    ])
    return {};

  }
  catch (err) {
    console.log('=== ============  Error ============== ', err);
    if (err.statusCode && err.customMessage)
      return Promise.reject(err);
    else {
      return Promise.reject(Config.APP_CONSTANTS.STATUS_MSG.ERROR.SOMETHING_WENT_WRONG);
    }
  }

};

const quizList = async (userData,payloadData) => {
  try{
    let {skip,limit}= payloadData;
    let finalData = {};
    await Promise.all([
       list = (async () =>{
         let options = {
           skip:skip,
           limit:limit,
           lean:true
         };
         const data = await Service.DataServices.getData(Models.quiz,{isActive:true,isDeleted:false},{},options);

         finalData.list = data;

       })(),
       count = (async () =>{
         const data = await Service.DataServices.dataCount(Models.quiz,{isActive:true,isDeleted:false});
         finalData.count = data;
       })()
    ]);
    return finalData
  }
  catch (err) {
    console.log('=== ============  Error ============== ', err);
    if (err.statusCode && err.customMessage)
      return Promise.reject(err);
    else {
      return Promise.reject(Config.APP_CONSTANTS.STATUS_MSG.ERROR.SOMETHING_WENT_WRONG);
    }
  }
};

const attemptQuiz = async (userData,payloadData) => {
  try{
    let {quizId,description,questions} = payloadData;
    let {id} = userData;

    let totalScore= questions.length;
    let correctScore = 0;
    for(let i =0;i<questions.length;i++){
      let correctAnswer = true;
      for(let j=0;j<questions[i].answers.length;j++){
        if(questions[i].answers[j].isCorrect !== questions[i].answers[j].isSelected){
          correctAnswer = false;
          break;
        }
      }
      if(correctAnswer){
        correctScore++;
      }

      questions[i].correctAnswer = correctAnswer;
    }

    let obj = {
      attemptBy:id,
      quizId:quizId,
      quizDescriptions:description,
      questions:questions,
      correctScore:correctScore,
      totalScore:totalScore
    }
    const data = await Service.DataServices.createData(Models.attempts,obj);

  }
  catch (err) {
    console.log('=== ============  Error ============== ', err);
    if (err.statusCode && err.customMessage)
      return Promise.reject(err);
    else {
      return Promise.reject(Config.APP_CONSTANTS.STATUS_MSG.ERROR.SOMETHING_WENT_WRONG);
    }
  }
};

const basicStats = async (userData) => {
  try {
    let {id} = userData;

    let pipeline = [
      {$match: {attemptBy: Mongoose.Types.ObjectId(id)}},
      {
        $group: {
          _id: "$quizId",
          totalAttempts: {$sum: 1},
          avgScore: {$avg: "$correctScore"},
          total: {$avg: "$totalScore"}
        }
      },
      {
        $lookup:{
          from: "quizzes",
          localField: "_id",
          foreignField: "_id",
          as: "quizDetails"
        }
      },
      {
        $unwind:{
          path : "$quizDetails",
          preserveNullAndEmptyArrays : true
        }
      },
      {
        $project:{
          totalAttempts:1,
          avgScore:1,
          total:1,
          quizName:"$quizDetails.description"
        }
      }
    ];

    const data = await Service.DataServices.dataAggregation(Models.attempts,pipeline)

    return data;

  }
  catch (err) {
    console.log('=== ============  Error ============== ', err);
    if (err.statusCode && err.customMessage)
      return Promise.reject(err);
    else {
      return Promise.reject(Config.APP_CONSTANTS.STATUS_MSG.ERROR.SOMETHING_WENT_WRONG);
    }
  }
};

const quizAttempts = async (userData,payloadData) => {
  try{
    let {quizId} = payloadData;
    let {id} = userData
    const data = await Service.DataServices.getData(Models.attempts,{attemptBy:id,quizId:quizId},{},{lean:true});
    return data;
  }
  catch (err) {
    console.log('=== ============  Error ============== ', err);
    if (err.statusCode && err.customMessage)
      return Promise.reject(err);
    else {
      return Promise.reject(Config.APP_CONSTANTS.STATUS_MSG.ERROR.SOMETHING_WENT_WRONG);
    }
  }
};

module.exports = {
  createQuiz:createQuiz,
  editQuiz:editQuiz,
  quizList:quizList,
  attemptQuiz:attemptQuiz,
  basicStats:basicStats,
  quizAttempts:quizAttempts
};