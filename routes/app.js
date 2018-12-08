const express = require('express');
const app = new express();
const favicon = require('serve-favicon')
const path = require("path");
const bodyParser = require('body-parser');
//const mysql = require('mysql');
const PORT = process.env.PORT || 8080;

app.use(express.static('public'));
app.set('views', path.join(__dirname, '../','views'));
app.use(favicon(path.join(__dirname, '../public/','favicon.ico')))
app.use(bodyParser.urlencoded({ extended: true }));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');
// const sqlconn = mysql.createConnection({
//   host     : 'h2cwrn74535xdazj.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
//   user     : 'ssam7xjm54kms0e0',
//   password : 'tr9diqtobus8nu5y',
//   database : 'hei5xkowlg9oo6t4'
// });

//sqlconn.connect();

//sqlconn.connect()

// connection.query('SELECT 1 + 1 AS solution', function (err, rows, fields) {
//   if (err) throw err

//   console.log('The solution is: ', rows[0].solution)
// })

//sqlconn.end()

if (process.env.NODE_ENV === 'production') {
	app.use(express.static('client/build'));
}

app.all('*', function(req, res) {
res.header('Access-Control-Allow-Origin', '*');
res.header('Access-Control-Allow-Headers', 'Content-Type,accept,access_token,X-Requested-With');
res.sendFile(path.join(__dirname, '../', '/views/index.html'));
});



app.get('/', function(request, response){
    response.sendFile(path.join(__dirname, '../', '/views/index.html'));
});

app.get('/search', function(request, response){
 	//Get client request
 	//console.log(request.query.sid);
 	var results = request.query.sid;
 	//construct and pass query to mysql
 	//var qry = "SELECT urlNames FROM URL WHERE urlNames LIKE CONCAT('%','" + results + "'',%')";
	//var out = sqlconn.query(qry, function (err, result, fields) {
	//	if (err) {
	//		console.log(err);
	//		return;
	//	}
	//	var rows = JSON.parse(JSON.stringify(result[0]));
	//	console.log("Result: " + rows);
	//});
 	response.render(path.join(__dirname, '../', 'views/search.html'),{results:results})
	//Connection Timeout
	//setTimeout(() => {
	//	sqlconn.end();
	//	}, 10000);
});

app.listen(PORT,() => {
	console.log("Running at Port " + PORT);
});