import mongoose from "mongoose";

const Schema = mongoose.Schema;

const Todo = new Schema({
    task : {
        type : String,
        required : true
    },
    isCompleted : {
        type : Boolean,
        required : true
    },
    time : {
        type : Date,
        default : Date.now(),
        required : false
    }
},
{
    strict : false
}
)

export const todo = mongoose.model("todo",Todo);

// ES5 statement
// module.exports = mongoose.model("todo",todo);