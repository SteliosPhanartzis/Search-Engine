if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

// Packages and variables
const express = require('express');
const app = express();
const favicon = require('serve-favicon')
const path = require("path");
const bodyParser = require('body-parser');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const initializePassport = require('./passport-config')
const PORT = process.env.PORT || 5300;
var sql_input;
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
app.set('views', path.join(__dirname, '../', 'views'));
app.use(favicon(path.join(__dirname, '../public/', 'favicon.ico')))
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
const sqlconn = {
    url: process.env.JAWSDB_URL,
	debug: 'false'
};

// Function to sanitize input
function sanitizer(input) {
	var reg = /[&<>"'/\\]/ig;
	var map = {
		'<': '&lt;',
		'>': '&gt;',
		'&': '&amp;',
		'"':'&quot;',
		"'": '&#x27;',
		"/": '&#x2F;',
		"\\": '&#x5C;'
	};
	return input.replace(reg, (char)=>(map[char]));
}
// Function to handle disconnects from mySql DB
function handleDisconnect() {
    console.log('1. connecting to db:');
    // Recreate the connection, since the old one cannot be reused.
    connection = mysql.createConnection(sqlconn);
    // The server is either down or restarting (takes a while sometimes).
    connection.connect(function (err) {
        if (err) {
            console.log('2. error when connecting to db:', err);
            // We introduce a delay before attempting to reconnect, to avoid a hot loop, and to allow our node script to
            // script to process asynchronous requests in the meantime. If you're also serving http, display a 503 error.
            setTimeout(handleDisconnect, 1000);
        }
    });
    connection.on('error', function (err) {
        console.log('3. db error', err);
        // Connection to the MySQL server is usually lost due to either server restart, or a connnection idle timeout
        // (the wait_timeout server variable configures this)
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            handleDisconnect();
        } else {
            throw err;
        }
    });
}
//Function to handle safe searches
function safeSearch(input, callback) {
    connection = mysql.createConnection(sqlconn);
    connection.connect();
    var searchRegEx = /[\s\(\)-\+\:\;\'\"\.\?\!]/;
    //Sanitize the input
    input = sanitizer(input);
    var safeqry = "select * FROM PRITSUS WHERE PROFANITY = '" + input + "'";
    // Callback to return result
    var out = connection.query(safeqry, function (err, rows, fields) {
        // Error handler
        if (err) {
            console.log(err);
            // throw err;
        }
        // Returns result
        callback(err, rows);
    });
    connection.end();
}
// Function to query DB with user input and return results as callback
function getURL(input, callback) {
    connection = mysql.createConnection(sqlconn);
    connection.connect();
    var searchRegEx = /[\s\(\)-\+\:\;\'\"\.\?\!]/;
    //Sanitize the input
    input = sanitizer(input);
    var arrIn = input.split(searchRegEx);
    var qry = "select URL from URLS where URL_ID in" +
              "(select URL_ID from TERM_URL where term_ID in" +
              "(select term_ID from TERMS where ";
    console.log(arrIn);
    // DB query
    for(var i = 0; i < arrIn.length; i++){
        qry += "term like '%" + arrIn[i] +"%'";
        if(i<(arrIn.length-1))
            qry+=' OR ';
        if(i>=(arrIn.length-1))
            qry+=')) ';
    }
    // Debug - check if input is passed
    console.log("input is " + input);
    // Callback to return result
    var out = connection.query(qry, function (err, rows, fields) {
        // Error handler
        if (err) {
            console.log(err);
            throw err;
        }
        // Returns result
        callback(err, rows);
    });
    connection.end();
}

//Handles any path call
app.all('/*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type,accept,access_token,X-Requested-With');
    next();
});
function getAdmin(input,callback) {
    connection = mysql.createConnection(sqlconn);
    connection.connect();
    var out = connection.query(input, function (err, rows, fields) {
        // Error handler
        if (err) {
            console.log(err);
            throw err;
        }
        // Returns result
        callback(err, rows);
    });
    connection.end();
}
//Default path call serves index.ejs
app.get('/', function (request, response) {
    response.render(path.join(__dirname, '../', '/views/index.ejs'));
});

//Path call when user has submitted a search
app.get('/search', function (request, response) {
    var sql_res = '';
    sql_input = request.query.sid;
    //SafeSearch
    safeSearch(sql_input, function (err, termList) {
        // Maybe add error handler
        // Check to make sure urlList is not null, then iterate
        if (termList.length > 0 && sql_input != /[\s]*/)
            response.render(path.join(__dirname, '../', 'views/search.ejs'), {results: "Assur!"});
        else{
    //Get Search
        getURL(sql_input, function (err, urlList) {
        // Maybe add error handler
        // Check to make sure urlList is not null, then iterate
        if (urlList.length > 0 || (urlList.length != null))
            for (var i = 0; i < urlList.length; i++)
                sql_res += '<div><a href = "' + urlList[i].URL + '">' + urlList[i].URL + '</a></div>';
        // Write function to loop through urlList to get urlList[i].URL_NAMES
        response.render(path.join(__dirname, '../', 'views/search.ejs'), {results: sql_res});
        }, 1000);
        }
    });
});

app.post('/a',function(req,res){
    res.render(path.join(__dirname, '../', '/views/admin.ejs'),{data:''});
});
app.get('/a',function(req,res){
    var getHistory = req.query.History;
    var getTermsURL  = req.query.Term_URL;
    var getTerms = req.query.Terms;
    var getURLS = req.query.URLS;
    var outArr = '';
    var qry;
    console.log(req.query);
    if(getTermsURL == 'Term_URL'){
        qry = "SELECT * FROM TERM_URL";
        outArr += '<tr><td>URL_ID</td>' + '<td>term_ID</td>' + '<td>frequency</td></tr>';
        getAdmin(qry,function (err, result){
            for(var i =0; i < result.length; i++){
                outArr += "<tr><td>" + result[i].URL_ID + "</td><td>" + result[i].term_ID + "</td><td>" + result[i].frequency + "</td></tr>";
            }
            res.render(path.join(__dirname, '../', '/views/admin.ejs'),{data:outArr});
        },1000);
    }
    else if(getHistory == 'History'){
        qry = "SELECT * FROM HISTORY";
        outArr += '<tr><td>SEARCH_ID</td>' + '<td>start_time</td>' + '<td>end_time</td></tr>';
        getAdmin(qry,function (err, result){
            for(var i =0; i < result.length; i++){
                outArr += "<tr><td>" + result[i].SEARCH_ID  + "</td><td>" + result[i].start_time  + "</td><td>" + result[i].end_time + "</td></tr>";
            }
            res.render(path.join(__dirname, '../', '/views/admin.ejs'),{data:outArr});
        },1000);
    }
    else if(getTerms == 'Terms'){
        qry = "SELECT * FROM TERMS";
        outArr += '<tr><td>term_ID</td>' + '<td>term</td></tr>';
        getAdmin(qry,function (err, result){
            for(var i =0; i < result.length; i++){
                outArr += "<tr><td>" + result[i].term_ID + "</td><td>" + result[i].term + "</td></tr>";
            }
            res.render(path.join(__dirname, '../', '/views/admin.ejs'),{data:outArr});
        },1000);
    }
    else if(getURLS == 'URLS'){
        qry = "SELECT * FROM URLS";
        outArr += '<tr><td>URL_ID</td>' + '<td>URL</td></tr>';
        getAdmin(qry,function (err, result){
            for(var i =0; i < result.length; i++){
                outArr += "<tr><td>" + result[i].URL_ID + "</td><td>" + result[i].URL + "</td></tr>";
            }
            res.render(path.join(__dirname, '../', '/views/admin.ejs'),{data:outArr});
        },1000);
    }
});

function checkAuthenticated(req, res, next){
    if (req.isAuthenticated())
        return next()
    else 
        res.redirect('/login')
}

function checkNotAuthenticated(req, res, next){
    if (req.isAuthenticated())
        return res.redirect('/')
    else 
        next()
}

app.listen(PORT, () => {
    console.log("Running at Port " + PORT);
});