// const mongoose = require('mongoose');
import mongoose from "mongoose";

const Schema = mongoose.Schema;

const User = new Schema({
        username : {
            type : String,
            required : true
        },
        password : {
            type : String,
            required : true
        },
        email : {
            type : String,
            required : true
        }
    },
    {
        strict : false
    }
)

// module.exports = mongoose.model('users',User);

export const user = mongoose.model('users',User);