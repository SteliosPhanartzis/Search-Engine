const express = require('express');
const app = new express();
var path = require("path");
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

app.set('views', path.join(__dirname, '../','views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.get('/', function(request, response){
    response.sendFile(path.join(__dirname, '../', '/views/index.html'));
});

app.get('/search', function(request, response){
 console.log(request.query.searchid);
 var results = request.query.searchid;
    response.render(path.join(__dirname, '../', 'views/search.html')),{results:results}
    // response.send('hello world');
});

app.listen(process.env.PORT || 3300);



console.log("Running at Port 3300");