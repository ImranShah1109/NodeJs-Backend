const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./UserSchema.js');
require('dotenv').config();


const app = express();
app.use(express.json());
const PORT = 8001;


// POST - Creating a new user
app.post('/signup', async (req, res) =>{

    try {
        const userBody = req.body;
        const salt = parseInt(process.env.SALT_ROUNDS)
        const hashPassword = await bcrypt.hash(userBody.password,salt);
        // console.log("hashed -> ",hashPassword)
        const userObj = new User({
            username : userBody.username,
            password : hashPassword,
            email : userBody.email
        });
        await userObj.save();

        res.status(200).send('User Created successfully!!');

    } catch (error) {
        console.log("err -> ",error);
        res.status(500).send("Internal server error"); 
    }

})


// POST - Login user
app.post('/login', async (req, res) =>{
    try {

        const loginBody = req.body;
        const userData =await User.findOne({username:loginBody.username});
        const isCorrectPassword =await bcrypt.compare(loginBody.password,userData.password)

        if(isCorrectPassword){
            res.status(200).send("User Logged in!!");
        }
        else{
            res.status(400).send("Your Password is incorrect");
        }

    } catch (error) {
        res.status(500).send("Internal server error");
    }
})

mongoose
    .connect(process.env.MONGODB_URI,{
        useNewUrlParser : true,
        useUnifiedTopology : true
    })
    .then(()=>console.log("MongoDB connected"))
    .catch((err)=>console.log(err));

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));