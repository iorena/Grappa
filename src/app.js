var express = require('express'),
    pg = require('pg'),
    app = express();

var port = 6667;
    
module.exports = (function() {
    console.log('moi');

        var server = app.listen(port, function() {
            console.log('listening');
        });


    }());
