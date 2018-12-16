const request = require('request');
const cheerio = require('cheerio');
const URL = require('url-parse');
const mysql = require('mysql');

let START_URL = "https://mashable.com/";
let SEARCH_WORD = "trump";
let MAX_PAGES_TO_VISIT = 1;

let pagesVisited = {};
let numPagesVisited = 0;
let pagesToVisit = [];
let url = new URL(START_URL);
let baseUrl;

let con = mysql.createConnection({
    host: "h2cwrn74535xdazj.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
    user: "ssam7xjm54kms0e0",
    password: "tr9diqtobus8nu5y",
    database: 'hei5xkowlg9oo6t4',
    debug: 'true'
});


pagesToVisit.push(START_URL);
crawl();

function crawl() {
    if (numPagesVisited >= MAX_PAGES_TO_VISIT) {
        console.log("Reached max limit of number of pages to visit.");
        return;
    }
    let nextPage = pagesToVisit.pop();
//    console.log(nextPage);
    if (nextPage in pagesVisited) {
        // We've already visited this page, so repeat the crawl
        crawl();
    } else if (typeof(nextPage) === "undefined") {
        console.log("That's it baby.");
    } else {
        // New page we haven't visited
        url = new URL(nextPage);
        baseUrl = url.protocol + "//" + url.hostname;
        visitPage(nextPage, crawl);
    }
}

function insertIntoDB(count, url) {
    debugger;
    console.log("SELECTING");
    con.connect(function (err) {
        if (err) throw err;
        console.log("Connected!");

        let insertURL = "INSERT INTO URLS (URL) VALUES (' " + url + "' )";
        let selectURL_ID = "SELECT URL_ID FROM URLS WHERE URL LIKE '%" + url+ "%' ";

        con.query(insertURL, function (err, result, fields) {
            if (err) throw err;
            console.log("inserted url", url, '\nresult was: ', result);
        });

        con.query(selectURL_ID, function (err, result, fields) {
            if (err) throw err;
            console.log("entire URL result", result);
            console.log("result[0][\"URL_ID\"]", result[0]["URL_ID"]);
            count['url_id'] = result[0]["URL_ID"];
        });
        for (let term in count) {
            if (!count.hasOwnProperty(term)) continue;
            let insertTerm = "INSERT INTO TERMS (TERM) VALUES (' " + term + " ')";
            let selectTerm_ID = "SELECT TERM_ID FROM TERMS WHERE TERM LIKE '%" + term + "%' ";
            debugger;

            con.query(insertTerm, function (err, result, fields) {
                if (err) throw err;
                console.log("Inserted term", term);
                console.log("insert term result", result);
            });
            con.query(selectTerm_ID, function (err, result, fields) {
                if (err) throw err;
                console.log("entire term result", result);
                console.log("result[0][\"TERM_ID\"]", result[0]["TERM_ID"]);
                count[term]["term_id"] = result[0]["TERM_ID"];

            });
            console.log(count[term]);
            console.log(count[url_id]);
            let insertTermsURL = "INSERT INTO TERM_URL (URL_ID, term_ID, frequency) VALUES (" + count.url_id + "," + count[term]["TERM_ID"] + "," + count[term]["frequency"] + ")";
            con.query(insertTermsURL, function (err, result, fields) {
                if (err) throw err;
                console.log("insert term url result", result);
                console.log("Inserted row", count.url_id + "," + count[term]["TERM_ID"] + "," + count[term]["frequency"]);
            });
            debugger;
        }
    });

}

function visitPage(url, callback) {
    // Add page to our set
    pagesVisited[url] = true;
    numPagesVisited++;
    // Make the request
    console.log("Visiting page " + url);
    request(url, function (error, response, body) {
        // Check status code (200 is HTTP OK)
        //console.log("Status code: " + response.statusCode);
        if (typeof(response) === "undefined" || response.statusCode !== 200) {
            callback();
            return;
        }
        // Parse the document body
        let $ = cheerio.load(body);
        let count = searchForWord($, SEARCH_WORD);
        collectInternalLinks($);
        insertIntoDB(count, url);
    });

    // con.query(sqlTerms, function(err, result) {
    //     if (err) throw err;
    //     console.log('One record inserted', result); //if the sql statement works, let us know by console logging
    // })
    // con.query(sqlUrls, function(err, result) {
    //     if (err) throw err;
    //     console.log('One record inserted', result); //if the sql statement works, let us know by console logging
    // })


    // con.query(select, function(err, result){
    //     if (err) throw err;
    //     console.log(result); //if the sql statement works, let us know by console logging
    // })
    // }

    //let sql = "INSERT INTO URL (terms, urls) VALUES ("+, '65-30 Kissena Blvd.')";

    //console.log(typeof(count));


//     if(isWordFound) {
//       console.log('Word ' + SEARCH_WORD + ' found at page ' + url);
//     }
    //collectInternalLinks($);
    // In this short program, our callback is just calling crawl()
    callback();

}

function searchForWord($, word) {
    let h1 = "";
    let h2 = "";
    let h3 = "";
    let p = "";
    $("h1").each(function () {
        h1 += $(this).text() + " ";
    });
    $("h2").each(function () {
        h2 += $(this).text() + " ";
    });
    $("h3").each(function () {
        h3 += $(this).text() + " ";
    });
    $("p").each(function () {
        p += $(this).text() + " ";
    });
    let meat = h1 + h2 + h3 + p;
    //console.log(countWords(meat));
    return (countWords(meat));

}

function countWords(sentence) {
    // count = [
    // {
    //     word: "",
    //     frequency: 0,
    //     tokenID: 0,
    //     urlID: 0
    // }];

    // count = {
        // "term" : {
        //      frequency: #,
        //      url_id: #,
        //      term_id: #
    // term["frequency"] == term.frequency


    let count = {},
        words = sentence
            .replace(/[.,?!;()"'-]/g, " ")
            .replace(/\s+/g, " ")
            .toLowerCase()
            .split(" ");

    words.forEach(function (word) {
        if (!(count.hasOwnProperty(word))) {
            count[word] = {};
            count[word]["frequency"] = 0;
            count[word]["term_id"] = "";
            count[word]["url_id"] = "";
        }
        count[word]["frequency"]++;
    });

    return count;
}

function collectInternalLinks($) {
    let relativeLinks = $("a[href^='/']");
    console.log("Found " + relativeLinks.length + " relative links on page");
    relativeLinks.each(function () {
        console.log(baseUrl + $(this).attr('href'));
        pagesToVisit.push(baseUrl + $(this).attr('href'));
    });
    let absoluteLinks = $("a[href^='http']");
    console.log("Found " + absoluteLinks.length + " absolute links on page");
    absoluteLinks.each(function () {
        if (!($(this).attr('href') in pagesVisited)) {
            console.log($(this).attr('href'));
            pagesToVisit.push($(this).attr('href'));
        }
    });
}
