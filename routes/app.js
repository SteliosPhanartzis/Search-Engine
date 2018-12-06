const express = require('express');
const app = new express();
const path = require("path");
const bodyParser = require('body-parser');
const mysql = require('mysql');
const PORT = process.env.PORT || 5042;
const sqlconn = mysql.createConnection({
  host     : 'h2cwrn74535xdazj.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
  user     : 'ssam7xjm54kms0e0',
  password : 'tr9diqtobus8nu5y',
  database : 'hei5xkowlg9oo6t4'
});

app.use(bodyParser.urlencoded({ extended: true }));

//sqlconn.connect()

// connection.query('SELECT 1 + 1 AS solution', function (err, rows, fields) {
//   if (err) throw err

//   console.log('The solution is: ', rows[0].solution)
// })

//sqlconn.end()

app.all('/*', function(req, res, next) {
res.header('Access-Control-Allow-Origin', '*');
res.header('Access-Control-Allow-Headers', 'Content-Type,accept,access_token,X-Requested-With');
next();
});


app.set('views', path.join(__dirname, '../','views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.listen(PORT,() => {
	console.log("Running at Port " + PORT);
});

app.get('/', function(request, response){
    response.sendFile(path.join(__dirname, '../', '/views/index.html'));
});

app.get('/search', function(request, response){
 	console.log(request.query.sid);
 	var results = request.query.sid;
	sqlconn.connect();
	sqlconn.query(results, function (err, rows, fields) {
		if (err) console.log(err);
		//console.log('The solution is: ', rows[0].solution)
	});
	sqlconn.end();
 	response.render(path.join(__dirname, '../', 'views/search.html'),{results:results})
});