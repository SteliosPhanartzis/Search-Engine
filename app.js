// const express = require('express')
// const app = express()
// const port = 3000

// app.get('/', (req, res) => res.send('/index.html'))

// app.listen(port, () => console.log(`Example app listening on port ${port}!`))
const express = require('express');
const app = new express();
var path = require("path");

app.get('/', function(request, response){
    response.sendFile(path.join(__dirname + '/views/index.html'));
});

app.listen(3000);



console.log("Running at Port 3000");