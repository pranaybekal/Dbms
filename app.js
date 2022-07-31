const express=require("express");
var session = require('express-session');
const mariadb = require('mariadb');
const bodyParser = require('body-parser');
const multer  = require('multer')


// const { connect } = require("./routes/register");0
// const { connecta } = require("./routes/info");

//
const app=express();
// app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use(bodyParser.json());
// public set
app.use(express.static('public'))
app.use('/css', express.static(__dirname + 'public/css'))
app.use('/routes', express.static(__dirname + '/routes'))
app.use('/js', express.static(__dirname + 'public/js'))
app.use('/img', express.static(__dirname + 'public/img'))

// Set Views
app.set('views', './views')
app.set('view engine', 'ejs')
app.use(session({
        secret: 'secret',
        resave: true,
        saveUninitialized: true
}));




// db connections

const connection = mariadb.createPool({
    host: 'remotemysql.com',
    user:'vZOUgF2Mzp',
    password: '88vmc4zQKg',
    database: 'vZOUgF2Mzp'
});


connection.getConnection()
    .then(conn=>
        {
            console.log("Connected")
        })
        .catch(err=>
            {
                console.log("error "+err);
            })

            module.exports= connection;


// --------------------------------------------------------------------------------------------------------------     

// routes


app.get('/', function(request, response) {
    response.render('index')
});

// students routes

const register= require('./routes/register');
const signup = require('./routes/signup');
const info = require('./routes/info');
const apply = require('./routes/apply');

// const signupsuccess = require('./routes/signupsuccess')

app.get('/register',register)
app.use('/student',signup)
app.use('/info',info)
app.use('/apply',apply)
// app.use('/success',signupsuccess)

//  company routes

const manager = require('./routes/mregister')
const img = require('./routes/pic')
app.use('/manager',manager)
app.use('/img',img)


// 404
app.use(function(req,res){
    res.status(404).render('404');
});



// ------------------------------------------------------------------------------------------------------------       
// listen  op
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Our app is running on port ${ PORT }`);
});