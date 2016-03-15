var http = require('http'),
    pg = require('pg');

var port = process.env.PORT || 6667;
    
module.exports = (function() {

    http.createServer(function(req, res) {
        res.writeHead(200, {'Content-Type' : 'text/plain'});
        res.end('porkkana');
    }).listen(port);


}());
