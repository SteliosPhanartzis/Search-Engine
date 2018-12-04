const express = require('express');
const app = new express();
var path = require("path");

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.get('/', function(request, response){
    response.sendFile(path.join(__dirname + '/views/index.html'));
});

app.get('/search', function(request, response){
	//test data
	// var results = "<table>" + 
	// "<tr><td>Henlo</td></tr>" +
 //    "<tr><td>A good result of a search description is this and boi howdy does it do a thing</td></tr>" +
 //    "<tr><td>http://www.fakeurl.com/thiswillstealyourcreditcardinfo?givemeyourmoney</td></tr>" +
 //    "<tr><td>Oh Waow</td></tr>" + 
 //    "<tr><td>I can't believe you found another result. Thas insane in the membrane. Henlo.</td></tr>"+
 //    "<tr><td>http://www.falseurl.com/thiswillstillstealyourcreditcardinfo?pleasegivemeyourmoney</td></tr>" +
 //  "</table>";
 console.log(request);
 var results = request;
    response.render(path.join(__dirname + '/views/search.html'),{results:results});
    // response.send('hello world');
});

app.listen(process.env.PORT || 8080);



console.log("Running at Port 8080");