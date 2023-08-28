import { user } from "../models/UserSchema.js";
// const User = require("../models/UserSchema.js");

export const isUserExisting = async (username) =>{
    let userData;
    try {
        userData = await user.findOne({username});
        console.log("userData --> ",userData);
    } catch (error) {
        console.log(error);
    }

    if(userData){
        return true;
    }else{
        return false;
    }
}