var request = require("request");
var expect = require("chai").expect;

describe('app', function() {
    var url = "http://localhost:9876"; 

    it('loads', function() {
        request(url, function(error, response, body) {
            expect(response.statusCode).to.equal(200);
        });
    });

    describe('thesis route', function() {

        url += "/theses";

        it('accepts request parameters', function() {
            request(url + "?testparam=666", function(error, response, body) {
                expect(response.body.result.testparam).to.equal(666);
            });
        });
    });

    describe('councilmeeting route', function() {

        url += "/councilmeetings";

        it('accepts request parameters', function() {
            request(url + "?testparam=666", function(error, response, body) {
                expect(response.body.result.testparam).to.equal(666);
            });
        });
    });





});
