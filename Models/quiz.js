let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let quiz = new mongoose.Schema({
  createdBy: {type: Schema.Types.ObjectId, ref: "user", required: true },
  description:{type:String,required:false},
  isDeleted: {type: Boolean, default: false, required: true},
  isActive: {type: Boolean, default: true, required: true},
  questions:[{
    questionName:{type:String,required:false},
    answers: [{
      text: {type: String, required: true},
      isCorrect: {type: Boolean, required: true, default: false}
    }],
  }],

},{ timestamps: true });

module.exports = mongoose.model('quiz', quiz);