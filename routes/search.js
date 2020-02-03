// Packages and variables
const express = require('express')
const router = express.Router()
const mysql = require('mysql');
const srvEnv = require('dotenv/config')
const path = require("path");
// Connection credentials to mysql db
const sqlconn = process.env.JAWSDB_URL;

//Path call when user has submitted a search
router.get('/', function (request, response) {
    var sql_res = '';
    sql_input = request.query.sid;
    //Check if string is not empty
    if(sql_input.length > 0){
        //SafeSearch
        safeSearch(sql_input, function (err, termList) {
            // Maybe add error handler
            // Check to make sure urlList is not null, then iterate
            if (termList.length > 0 && sql_input != /[\s]*/)
                response.render(path.join(__dirname, '../', 'views/search.ejs'), {results: "Assur!"});
            else{
        //Get Search
            getURL(sql_input, function (err, urlList) {
                // Maybe add error handler
                // Check to make sure urlList is not null, then iterate
                if (urlList.length > 0 || (urlList.length != null))
                    for (var i = 0; i < urlList.length; i++)
                        sql_res += '<div><a href = "' + urlList[i].URL + '">' + urlList[i].URL + '</a></div>';
                // Write function to loop through urlList to get urlList[i].URL_NAMES
                response.render(path.join(__dirname, '../', 'views/search.ejs'), {results: sql_res});
            }, 1000);
            }
        });
    }
    else
        response.render(path.join(__dirname, '../', 'views/search.ejs'), {results: sql_res});
});

// Function to sanitize input
function sanitizer(input) {
    var reg = /[&<>"'/\\]/ig;
    var map = {
        '<': '&lt;',
        '>': '&gt;',
        '&': '&amp;',
        '"':'&quot;',
        "'": '&#x27;',
        "/": '&#x2F;',
        "\\": '&#x5C;'
    };
    return input.replace(reg, (char)=>(map[char]));
}
//Function to handle safe searches
function safeSearch(input, callback) {
    connection = mysql.createConnection(sqlconn);
    connection.connect();
    var searchRegEx = /[\s\(\)-\+\:\;\'\"\.\?\!]/;
    //Sanitize the input
    input = sanitizer(input);
    var safeqry = "select * FROM PRITSUS WHERE PROFANITY = '" + input + "'";
    // Callback to return result
    var out = connection.query(safeqry, function (err, rows, fields) {
        // Error handler
        if (err) {
            console.log(err);
            // throw err;
        }
        // Returns result
        callback(err, rows);
    });
    connection.end();
}
// Function to query DB with user input and return results as callback
function getURL(input, callback) {
    connection = mysql.createConnection(sqlconn);
    connection.connect();
    var searchRegEx = /[\s\(\)-\+\:\;\'\"\.\?\!]/;
    //Sanitize the input
    input = sanitizer(input);
    var arrIn = input.split(searchRegEx);
    var qry = "select URL from URLS where URL_ID in" +
              "(select URL_ID from TERM_URL where term_ID in" +
              "(select term_ID from TERMS where ";
    console.log(arrIn);
    // DB query
    for(var i = 0; i < arrIn.length; i++){
        qry += "term like '%" + arrIn[i] +"%'";
        if(i<(arrIn.length-1))
            qry+=' OR ';
        if(i>=(arrIn.length-1))
            qry+=')) ';
    }
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
    connection.end();
}

module.exports = router