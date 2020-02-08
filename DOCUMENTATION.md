# Documentation

### Table of Contents
 * [Search Engine](#Search-Engine) 
 * [Crawler](#Crawler)
 * [API](#API)
 * [Database](#Database)

## Search-Engine

#### Preface
A .env file containing the connection string is needed to access the database. 
The contents of the file should contain `JAWSDB_URL=` followed by the connection string to the MySQL database you are using.
The connection string should look something like `mysql://[user]:[password]@[hostname]:[port]/[default schema]`
For access to the database hosted by heroku, contact @SteliosPhanartzis.

#### Deploying the Application Locally
* Clone the repository ontro your local environment
* Run `npm install` to install all dependencies
* From your terminal, cd to the cloned repository
* To ensure the application the application is opened in a development environment, type `npm run dev` and hit enter. 

## Crawler
To be completed

## API
To be completed

## Database
This application utilizes MySQL as part of its stack, the code given below to generate the necessary tables will be specifically for MySQL.

Please adhere to the given naming conventions to ensure the app functions properly.

#### ADMIN
Contains login information for administrator view access.

```
CREATE DATABASE  IF NOT EXISTS `hei5xkowlg9oo6t4` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `hei5xkowlg9oo6t4`;

SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

-- GTID state at the beginning of the backup 

SET @@GLOBAL.GTID_PURGED='';

-- Table structure for table `ADMIN`

DROP TABLE IF EXISTS `ADMIN`;

CREATE TABLE `ADMIN` (
  `admin_ID` int(5) unsigned NOT NULL AUTO_INCREMENT,
  `userName` varchar(50) NOT NULL,
  `password` varchar(50) NOT NULL,
  PRIMARY KEY (`admin_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
```

#### PRITSUS
Contains a list of forbidden terms for the safe search functionality.

```
CREATE DATABASE  IF NOT EXISTS `hei5xkowlg9oo6t4` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `hei5xkowlg9oo6t4`;

SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

-- GTID state at the beginning of the backup 

SET @@GLOBAL.GTID_PURGED='';

-- Table structure for table `PRITSUS`

DROP TABLE IF EXISTS `PRITSUS`;

CREATE TABLE `PRITSUS` (
  `PRITSUS_ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `PROFANITY` varchar(50) NOT NULL,
  PRIMARY KEY (`PRITSUS_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=103794 DEFAULT CHARSET=utf8;

SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
```

#### TERM_URL
Contains url ID, term ID, and number of times the term was associated with the url. Used to prioritze urls that have higher frequencies of relevant terms.

```
CREATE DATABASE  IF NOT EXISTS `hei5xkowlg9oo6t4` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `hei5xkowlg9oo6t4`;

SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

-- GTID state at the beginning of the backup 

SET @@GLOBAL.GTID_PURGED='';

-- Table structure for table `TERM_URL`

DROP TABLE IF EXISTS `TERM_URL`;

CREATE TABLE `TERM_URL` (
  `URL_ID` int(5) unsigned NOT NULL,
  `term_ID` int(5) unsigned NOT NULL,
  `frequency` int(5) unsigned NOT NULL,
  KEY `FK_URL_ID` (`URL_ID`),
  KEY `FK_terms_ID` (`term_ID`),
  CONSTRAINT `FK_URL_ID` FOREIGN KEY (`URL_ID`) REFERENCES `URLS` (`URL_ID`) ON DELETE CASCADE,
  CONSTRAINT `FK_terms_ID` FOREIGN KEY (`term_ID`) REFERENCES `TERMS` (`term_ID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
```

#### TERMS
Contains a list of terms pulled from indexed urls.

```
CREATE DATABASE  IF NOT EXISTS `hei5xkowlg9oo6t4` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `hei5xkowlg9oo6t4`;

SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

-- GTID state at the beginning of the backup 

SET @@GLOBAL.GTID_PURGED='';

-- Table structure for table `TERMS`

DROP TABLE IF EXISTS `TERMS`;

CREATE TABLE `TERMS` (
  `term_ID` int(5) unsigned NOT NULL AUTO_INCREMENT,
  `term` varchar(50) NOT NULL,
  PRIMARY KEY (`term_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=192861 DEFAULT CHARSET=utf8;

SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
```

#### URLS
Contains a list of urls that were indexed.
```
CREATE DATABASE  IF NOT EXISTS `hei5xkowlg9oo6t4` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `hei5xkowlg9oo6t4`;

SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

-- GTID state at the beginning of the backup 

SET @@GLOBAL.GTID_PURGED='';

-- Table structure for table `URLS`

DROP TABLE IF EXISTS `URLS`;

CREATE TABLE `URLS` (
  `URL_ID` int(5) unsigned NOT NULL AUTO_INCREMENT,
  `URL` varchar(50) NOT NULL,
  PRIMARY KEY (`URL_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=1005 DEFAULT CHARSET=utf8;

SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
```