const express = require('express');
const app = new express();
var path = require("path");

app.get('/', function(request, response){
    response.sendFile(path.join(__dirname + '/views/index.html'));
});

app.get('/search', function(request, response){
    // response.sendFile(path.join(__dirname + '/views/search.html'));
    response.send('hello world');
});

app.listen(3000);



console.log("Running at Port 3000");