const express = require('express')
const mysql = require('mysql')

require('dotenv').config();


const app = express()
const PORT = 3000

app.use(express.json());

// create connection object of mysqldb
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: process.env.MYSQL_PASS,
    database: "mytodos",
    port: 3306,
    multipleStatements: true
})

//establish connection with mysql db
db.connect((err)=>{
    if(err){
        throw err;
    }
    console.log("DB Connected!")
})


// POST - add todo in db
app.post('/todo',(req,res)=>{
    const {task, isCompleted, date, username} = req.body;
    
    let query = `INSERT INTO todos (task,is_completed,date,username) VALUES
                ('${task}',${isCompleted},'${date}','${username}')`;
    
    db.query(query,(err,result)=>{
        try {
            if(err) throw err;

            res.send("New todo has been created");
        } catch (error) {
            console.log("error ->",error);
        }
    });
})

// GET - fetch all todos base on username
app.get('/todos/:username',(req,res)=>{
    const username = req.params.username;

    let query = `SELECT * FROM todos WHERE username = '${username}'`;

    db.query(query,(err,result)=>{
        if(err) throw err;
        res.send({"data":result});
    })
})

//DELETE -  Delete the todo based on id
app.delete('/todo/:id', (req, res)=>{
    const todoId = req.params.id;

    const query = `DELETE FROM todos WHERE id=${todoId}`;
    db.query(query,(err, result)=>{
        if(err) throw err;

        res.send('Todo deleted sucessfully!');
    })
})

app.listen(PORT, () => console.log(`Server is running on port ${PORT}!`))