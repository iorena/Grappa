var http = require('http'),
    pg = require('pg');

var port = process.env.PORT || 6667,
    dburl = process.env.DATABASE_URL;
    
module.exports = (function() {

    var dbclient = new pg.Client(dburl);
    dbclient.connect();
    dbclient.end();
    
    http.createServer(function(req, res) {
        res.writeHead(200, {'Content-Type' : 'text/plain'});
        res.end('porkkana');
    }).listen(port);


}());
