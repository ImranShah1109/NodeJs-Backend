import { model } from "mongoose";

export const LoggerMiddelware = (req,res,next) => {
    // sample logger
    console.log(`Header : ${JSON.stringify(req.headers)}`)
    console.log(`Body : ${JSON.stringify(req.body)}`)
    console.log(`URL : ${req.url}`)
    console.log(`Method : ${req.method}`);

    //after below code endpoint code will execute
    next();
}

// module.exports = { LoggerMiddelware }