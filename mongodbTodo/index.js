import express from "express";
import mongoose from "mongoose";
import {todo} from "./TodoSchema.js";
import dotenv from "dotenv";
// ES5 way 
// const Todo = require("./TodoSchema.js")

dotenv.config(); // for .env file
// console.log(process.env.MONGODB_URI)
const app = express();
const PORT = 8001;

app.use(express.json());

// below code is middleware code
app.use((req,res,next)=>{
    // sample logger
    console.log(`Header : ${req.header}`)
    console.log(`Body : ${req.body}`)
    console.log(`URL : ${req.url}`)
    console.log(`Method : ${req.method}`);

    //after below code endpoint code will execute
    next();
})


//GET - fetch the all todos
app.get('/todos', async(req, res) => {
  try {
    const todos = await todo.find({});
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

// new todo
app.post('/todo', (req, res) => {
    try{
        const todoObj = new todo({
            task : req.body.task,
            isCompleted : req.body.isCompleted
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