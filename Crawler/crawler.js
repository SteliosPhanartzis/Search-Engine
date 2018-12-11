var request = require('request');
var cheerio = require('cheerio');
var URL = require('url-parse');
var mysql = require('mysql');

var START_URL = "https://mashable.com/";
var SEARCH_WORD = "trump";
var MAX_PAGES_TO_VISIT = 1;

var pagesVisited = {};
var numPagesVisited = 0;
var pagesToVisit = [];
var url = new URL(START_URL);
var baseUrl;

var con = mysql.createConnection({
  host: "h2cwrn74535xdazj.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
  user: "ssam7xjm54kms0e0",
  password: "tr9diqtobus8nu5y",
    database : 'hei5xkowlg9oo6t4',
    debug : 'false'
});


pagesToVisit.push(START_URL);
crawl();

function crawl() {
  if(numPagesVisited >= MAX_PAGES_TO_VISIT) {
    console.log("Reached max limit of number of pages to visit.");
    return;
  }
  var nextPage = pagesToVisit.pop();
    debugger;
//    console.log(nextPage);
  if (nextPage in pagesVisited) {
    // We've already visited this page, so repeat the crawl
    crawl();
  } else if (typeof(nextPage) =="undefined"){
      console.log("That's it baby.");
      return;
  }else {
    // New page we haven't visited
    url = new URL(nextPage);
    baseUrl = url.protocol + "//" + url.hostname;
    visitPage(nextPage, crawl);
  }
}

function visitPage(url, callback) {
  // Add page to our set
  pagesVisited[url] = true;
  numPagesVisited++;
  // Make the request
  console.log("Visiting page " + url);
  request(url, function(error, response, body) {
     // Check status code (200 is HTTP OK)
      debugger;
     //console.log("Status code: " + response.statusCode);
     if(typeof(response) =="undefined" || response.statusCode !== 200) {
       callback();
       return;
     }
     // Parse the document body
     var $ = cheerio.load(body);
      var count = searchForWord($, SEARCH_WORD);
      console.log(count);
      con.connect(function(err) {
        if (err) throw err;
        console.log("Connected!");
          count.forEach(makeQuery);

          function makeQuery(value){
              debugger;
              var sql = "INSERT INTO URL (terms, urls) VALUES ('"+value+"', '"+url+"')";
          }
        //var sql = "INSERT INTO URL (terms, urls) VALUES ("+, '65-30 Kissena Blvd.')";
      });
      //console.log(typeof(count));

      collectInternalLinks($);
//     if(isWordFound) {
//       console.log('Word ' + SEARCH_WORD + ' found at page ' + url);
//     }
       //collectInternalLinks($);
       // In this short program, our callback is just calling crawl()
       callback();
  });
}

function searchForWord($, word) {
    var h1="";
    var h2="";
    var h3="";
    var p = "";
    var bodyText = $("h1").each(function(){
        h1+=$(this).text()+" ";
    })
    bodyText = $("h2").each(function(){
        h2+=$(this).text()+" ";
    })
    bodyText = $("h3").each(function(){
        h3+=$(this).text()+" ";
    })
    bodyText = $("p").each(function(){
        p+=$(this).text()+" ";
    })
    console.log(p);
    var meat = h1+h2+h3+p;
    //console.log(countWords(meat));
    return(countWords(meat));

}

function countWords(sentence) {
  var index = [],
      words = sentence
              .replace(/[.,?!;()"'-]/g, " ")
              .replace(/\s+/g, " ")
              .toLowerCase()
              .split(" ");

    words.forEach(function (word) {
        if (!(index.hasOwnProperty(word))) {
            index.push(word);
        }
        //index[word]++;
    });

    return index;
}

function collectInternalLinks($) {
    var relativeLinks = $("a[href^='/']");
    console.log("Found " + relativeLinks.length + " relative links on page");
    relativeLinks.each(function() {
        console.log(baseUrl + $(this).attr('href'));
        pagesToVisit.push(baseUrl + $(this).attr('href'));
    });
    var absoluteLinks = $("a[href^='http']");
    console.log("Found " + absoluteLinks.length + " absolute links on page");
    absoluteLinks.each(function() {
        if(!($(this).attr('href') in pagesVisited)){
            console.log($(this).attr('href'));
            pagesToVisit.push($(this).attr('href'));
        }
    });
}
