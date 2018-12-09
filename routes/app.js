//Packages and variables
const express = require('express');
const app = new express();
const favicon = require('serve-favicon')
const path = require("path");
const bodyParser = require('body-parser');
const mysql = require('mysql');
const PORT = process.env.PORT || 5090;
var sql_input;
var connection;

// Set up paths and stuff for express
app.use(express.static('public'));
app.set('views', path.join(__dirname, '../','views'));
app.use(favicon(path.join(__dirname, '../public/','favicon.ico')))
app.use(bodyParser.urlencoded({ extended: true }));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');

// Connection credentials to mysql db. Probably not safe to just publicly upload to github.
const sqlconn = {
  host     : 'h2cwrn74535xdazj.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
  user     : 'ssam7xjm54kms0e0',
  password : 'tr9diqtobus8nu5y',
  database : 'hei5xkowlg9oo6t4',
  debug : 'false'
};

// if (process.env.NODE_ENV === 'production') {
// 	app.use(express.static('client/build'));
// }

// Function to handle disconnects from mySql DB
function handleDisconnect() {
    console.log('1. connecting to db:');
    // Recreate the connection, since the old one cannot be reused.
    connection = mysql.createConnection(sqlconn); 
	// The server is either down or restarting (takes a while sometimes).
    connection.connect(function(err) {
        if (err) {
            console.log('2. error when connecting to db:', err);
            // We introduce a delay before attempting to reconnect, to avoid a hot loop, and to allow our node script to
            // script to process asynchronous requests in the meantime. If you're also serving http, display a 503 error.
            setTimeout(handleDisconnect, 1000);
        }
    });
    connection.on('error', function(err) {
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
handleDisconnect();

// Function to query DB with user input and return results as callback
function getURL(input, callback) {
	// DB query
	var qry = 'SELECT URL_NAMES FROM URL WHERE URL_NAMES LIKE \'%' + input + '%\'';
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
}

//Handles any path call
app.all('/*', function(req, res, next) {
res.header('Access-Control-Allow-Origin', '*');
res.header('Access-Control-Allow-Headers', 'Content-Type,accept,access_token,X-Requested-With');
next();
});


//Default path call serves index.html
app.get('/', function(request, response){
    response.sendFile(path.join(__dirname, '../', '/views/index.html'));
});

//Path call when user has submitted a search
app.get('/search', function(request, response){
 	var sql_res;
 	sql_input = request.query.sid;
	getURL(sql_input, function (err, urlList){ 
			// Maybe add error handler 
			// Selects just first result for now     
			sql_res = urlList[0].URL_NAMES;
			// Confirms urList is an array
			console.log("List is " + urlList.length);
			// Write function to loop through urlList to get urlList[i].URL_NAMES
	    	response.render(path.join(__dirname, '../', 'views/search.html'),{results:sql_res});
		    console.log("Results are " + sql_res);     
	},1000);
});

app.listen(PORT,() => {
	console.log("Running at Port " + PORT);
});