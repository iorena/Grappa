var http = require('http'),
    pg = require('pg');

var port = 6667;
    
module.exports = (function() {

        http.createServer(function(req, res) {
            res.writeHead(200, {'Content-Type' : 'text/plain'});
            res.end('moi');
        }).listen(port);


    }());
