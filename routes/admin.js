// Packages and variables
const express = require('express')
const router = express.Router()
const mysql = require('mysql');
const path = require("path");
if (process.env.NODE_ENV !== 'production') 
    require('dotenv').config()

//Logging in to admin account
router.post('/',function(req,res){
    res.render(path.join(__dirname, '../', '/views/admin.ejs'),{data:''});
});
//Get admin page
router.get('/',function(req,res){
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

//Function to check admin credentials
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

module.exports = router