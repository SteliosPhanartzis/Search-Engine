const express = require('express');
const app = new express();
var path = require("path");
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 5000;
app.use(bodyParser.urlencoded({ extended: true }));

app.all('/*', function(req, res, next) {
res.header('Access-Control-Allow-Origin', '*');
res.header('Access-Control-Allow-Headers', 'Content-Type,accept,access_token,X-Requested-With');
next();
});

app.set('views', path.join(__dirname, '../','views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.get('/', function(request, response){
    response.sendFile(path.join(__dirname, '../', '/views/index.html'));
});

app.get('/search', function(request, response){
 console.log(request.query.sid);
 var results = request.query.sid;
    response.render(path.join(__dirname, '../', 'views/search.html'),{results:results})
    // Query db function would get handled here
});

app.listen(PORT,() => {
	console.log("Running at Port " + PORT);
});