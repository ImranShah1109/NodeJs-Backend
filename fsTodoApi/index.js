const express = require("express");
const fs = require("fs");

const app = express();

const PORT = 8001;

app.use(express.json());

//POST for create todo
app.post('/todo',(req,res) => {
    const newTodo = req.body;

    const fileData = JSON.parse(fs.readFileSync('./database.json').toString());

    fileData.todos.push(newTodo);

    fs.writeFileSync('./database.json',JSON.stringify(fileData));
})

app.listen(PORT,() => {
    console.log("Server is running on 8001!");
});