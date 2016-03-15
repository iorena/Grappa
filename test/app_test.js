var request = require('request');

describe('app', function() {
    it('should load', function() {
        var url = 'http://localhost:' + process.env.PORT; 
        request(url, function(error, response, body) {
            expect(response.statusCode).to.equal(200);
        });
    };

});
