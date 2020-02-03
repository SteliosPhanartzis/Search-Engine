// Packages and variables
const express = require('express');
const app = express();
const favicon = require('serve-favicon')
const path = require("path");
const bodyParser = require('body-parser');
const mysql = require('mysql');
const srvEnv = require('dotenv/config')
const bcrypt = require('bcrypt');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const initializePassport = require('./passport-config')
const PORT = process.env.PORT || 5300;
var connection;

//Set up authentication for admin access
initializePassport(
    passport, 
    name => users.find(user => user.name === name),
    id => users.find(user => user.id === id)
)

const users = [{id: '1567823659832',
                name: 'admin',
                password: 'password'
              }]

// Set up paths and stuff for express
app.use(express.static('public'));
app.set('views', path.join(__dirname, './views/'));
app.use(favicon(path.join(__dirname, './public/', 'favicon.ico')))
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())

// Connection credentials to mysql db
const sqlconn = process.env.JAWSDB_URL;

//Handles any path call
app.all('/*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type,accept,access_token,X-Requested-With');
    next();
});

//Default path call serves index.ejs
app.get('/', function (request, response) {
    response.render(path.join(__dirname, './', '/views/index.ejs'));
});
//Search route
const searchRouter = require('./routes/search')
app.use('/search', searchRouter)
//Admin route
const adminRouter = require('./routes/admin')
app.use('/admin', adminRouter)

app.listen(PORT, () => {
    console.log("Running at Port " + PORT);
});