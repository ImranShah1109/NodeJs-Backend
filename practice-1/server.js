// ES6 import express from "express"

// ES5

const express = require("express");

const app = express();

// for pass the data from client in the form of json in body then do
app.use(express.json());

// example of post req in which pass the body

app.post('/add',(req,res)=>{
    let body = req.body;
    console.log(body);
})

app.get('/test',(req,res)=>{
    return res.send("Server is running at 8001");
})

//hello world api
app.get('/helloworld',(req,res)=>{
    return res.status(200).json({data : 'Hello World'})
})

//parametarize endpoint
app.get('/profile/:userId',(req,res)=>{
    console.log(req.params.userId);
})

//query endpoint -> eg :- localhost:8001/profile?name=imran
app.get('/profile',(req,res)=>{
    console.log(req.query);
})

app.listen(8001,()=>{
    console.log("Your server run on port 8001");
})