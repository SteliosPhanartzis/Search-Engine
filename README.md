# AskLawrence Search Screen and Engine

We are live at [Ask Lawrence](https://ask-lawrence.herokuapp.com)!

The repository includes the design and implementation of both front-end (client-side) and back-end (server-side) functionality
to support a rudimentary search engine.
 
Note: this repo is not front-end to access an existing search engine such as Google.

## Components
*  MySQL database to store information from and about indexed internet pages, and also track user queries
* Functionality to automatically visit web pages, parse their content, and store as indexed information in database
* Front-end to enter search criteria
* Functionality to compare search criteria to information stored in database and determine web pages that contain
those terms
* Front-end to receive search results and from which access those pages
* Front-end for Admin to see which pages got indexed, how long it took, etc.
* Front-end for Admin to manage which future pages will get indexed
* Front-end for Admin to view information stored in database, including a history of users’ search queries and result
counts

This search engine also has a "safe search" which filters out queries containing profane language.

## Team Members

* Mark Abramov (@markab4) - Frontend, Web Crawler, Safe Search
* Maxwell Grossman (@maxperryg) - Web Crawler, Indexing
* Maxwell Richter (@maxwellrichter) - Frontend
* Stelios Phanartzis (@SteliosPhanartzis) - Backend
* Jose Delaguarda (@josedlg) - Database
