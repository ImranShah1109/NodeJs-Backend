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

app.listen(PORT, () => console.log(`Server is running on port ${PORT}!`))