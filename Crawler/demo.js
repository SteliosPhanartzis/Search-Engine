const mysql = require('mysql');

var con = mysql.createConnection({
    host: "h2cwrn74535xdazj.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
    user: "ssam7xjm54kms0e0",
    password: "tr9diqtobus8nu5y",
    database: 'hei5xkowlg9oo6t4',
    debug: 'false'
});

con.connect(function(err) {
    if (err) throw err;
    con.query("SELECT * FROM TERMS", function (err, result, fields) {
        if (err) throw err;
        console.log(result);
    });
});