var request = require('request');

describe('app', function() {
    it('should load', function() {
        var url = 'http://tktl-grappa.herokuapp.com:' + process.env.PORT; 
        request(url, function(error, response, body) {
            expect(response.statusCode).to.equal(200);
        });
    };

});
