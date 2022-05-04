let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let attempts = new mongoose.Schema({
  attemptBy: {type: Schema.Types.ObjectId, ref: "user", required: true },
  quizId: {type: Schema.Types.ObjectId, ref: "quiz", required: true },
  quizDescriptions:{type:String,required:false},
  questions:[{
    questionName:{type:String,required:false},
    answers: [{
      text: {type: String, required: true},
      isCorrect: {type: Boolean, required: true, default: false},
      isSelected:{type:Boolean,required:true,default:false}
    }],
    correctAnswer:{type:Boolean,required:true,default:false}
  }],
  correctScore:{type:Number},
  totalScore:{type:Number}

},{ timestamps: true });

module.exports = mongoose.model('attempts', attempts);