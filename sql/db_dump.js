var pg = require("pg"), 
    config = require("../config.js");


var dbclient = new pg.Client(config.dburl);

dbclient.connect();
dbclient.end();
