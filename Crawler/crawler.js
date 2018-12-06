var request = require('request');
var cheerio = require('cheerio');
var URL = require('url-parse');

var START_URL = "https://www.yahoo.com/news/";
var SEARCH_WORD = "trump";
var MAX_PAGES_TO_VISIT = 10;

var pagesVisited = {};
var numPagesVisited = 0;
var pagesToVisit = [];
var url = new URL(START_URL);
var baseUrl = url.protocol + "//" + url.hostname;

pagesToVisit.push(START_URL);
crawl();

function crawl() {
  if(numPagesVisited >= MAX_PAGES_TO_VISIT) {
    console.log("Reached max limit of number of pages to visit.");
    return;
  }
  var nextPage = pagesToVisit.pop();
//    console.log(nextPage);
  if (nextPage in pagesVisited) {
    // We've already visited this page, so repeat the crawl
    crawl();
  } else if (typeof(nextPage) =="undefined"){
      console.log("That's it baby.");
      return;
  }else {
    // New page we haven't visited
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
     var isWordFound = searchForWord($, SEARCH_WORD);
     if(isWordFound) {
       console.log('Word ' + SEARCH_WORD + ' found at page ' + url);
     }
       collectInternalLinks($);
       // In this short program, our callback is just calling crawl()
       callback();
  });
}

function searchForWord($, word) {
  var bodyText = $('html > body').text().toLowerCase();
  return(bodyText.indexOf(word.toLowerCase()) !== -1);
}

function collectInternalLinks($) {
    var relativeLinks = $("a[href^='http']");
    //debugger;
    //var relativeLinks = $('a');
    console.log("Found " + relativeLinks.length + " relative links on page");
    relativeLinks.each(function() {
        if(!($(this).attr('href') in pagesVisited)){
            console.log($(this).attr('href'));
            pagesToVisit.push($(this).attr('href'));
        }
    });
}
