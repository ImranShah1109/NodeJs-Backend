import express from "express";
import mongoose from "mongoose";
import {todo} from "./models/TodoSchema.js";
import dotenv from "dotenv";
import { isAuth } from "./middelwares/AuthMiddelware.js";
import { isUserExisting } from "./utils/UsernameCheck.js";
import { user } from "./models/UserSchema.js"
import { LoggerMiddelware } from "./middelwares/LoggerMiddelwares.js"
import bcrypt from "bcrypt"
// ES5 way 
// const Todo = require("./TodoSchema.js")
// const { LoggerMiddelware } = require('./middelwares/LoggerMiddelwares.js');

dotenv.config(); // for .env file
// console.log(process.env.MONGODB_URI)
const app = express();
const PORT = 8001;

app.use(express.json());

// below code is middleware code
app.use( LoggerMiddelware );

// POST - Creating new user
app.post('/signup', async (req, res) =>{

    try {
        const userBody = req.body;
        const userExist =await isUserExisting(userBody.username);
        // console.log("Body -->",userExist);
        if(userExist){
            res.send({
                status : 400,
                message : "User already exist"
            });

            return;
        }
        const salt = parseInt(process.env.SALT_ROUNDS)
        const hashPassword = await bcrypt.hash(userBody.password,salt);
        // console.log("hashed -> ",hashPassword)
        const userObj = new user({
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
        const userData =await user.findOne({username:loginBody.username});
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

//GET - fetch the all todos
app.get('/todos/:username', isAuth, async(req, res) => {
  try {
    const username = req.params.username;
    const todos = await todo.find({ username });
    res.status(200).json({data:todos});
  }catch (error) {
    res.status(500).send("Internal server error");
  }
});

//GET - fetch the todo by id
app.get('/todo/:id', async(req, res) => {
    try {
        const todoId = req.params.id;
        const todoObj = await todo.findById(todoId);

        res.status(200).json({data:todoObj})
    } 
    catch (error) {
        res.status(500).send("Internal server error");
    }
})

//isAuth is middelware to check is user loged in or not
// new todo
app.post('/todo', isAuth ,(req, res) => {
    const { task, isCompleted, username } = req.body;

    if (task.length == 0 || isCompleted == null || username.legnth == 0) {
        res.send({
        status: 400,
        message: "Please enter the values in correct format!",
        });
    }
    try{
        const todoObj = new todo({
            task : task,
            isCompleted : isCompleted,
            username : username
        })

    // save the object in db
        todoObj.save();
        res.status(200).send("New Todo Created!");
    }
    catch(err){
        res.status(500).send("Internal Server Error")
    }
})

// DELETE - delete the one todo by id
app.delete('/todo/:id', async (req, res) => {
    try {
        const todoId = req.params.id;
        await todo.findByIdAndDelete(todoId);
        res.status(200).send("Todo is deleted successfully !")
    }catch (error) {
        console.log(error);
        res.status(500).send("Internal server error");
    }
});

// PUT - update the todo
app.put('/todo', async(req, res) =>{
    try {
        const { id, isCompleted} = req.body;
        await todo.findByIdAndUpdate(id,{isCompleted:isCompleted});
        res.status(200).send(`Todo has id is ${id} updated sucessfully`);
    }catch(error) {
        res.status(500).send("Internal server error");
    }
  
});

mongoose
    .connect(process.env.MONGODB_URI,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(()=> console.log("MongoDB connected"))
    .catch((err)=>console.log(err));


app.listen(PORT,()=>{
    console.log("Server is runnig at ",PORT);
})