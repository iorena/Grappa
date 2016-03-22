var express = require("express"),
    bodyParser = require("body-parser"),
    setImmediate = require("setimmediate"),
    app = express();
    
var dbRequest = require("./dbRequest.js");
var seeds = require("../sql/seeds.js");
    
module.exports = (function() {

    var port = process.env.PORT || 9876;

    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());
    var router = express.Router();

    /* set the routes */

    router.get("/", function(request, result) {
        result.json({ message : "This is the default page. Nothing to see here" });
    });

    router.get("/theses", function(request, result) {
        dbRequest.list(request.query, "thesis", function(results) {
            result.json({ message : "This is where I list all the theses",
                      result : results });
        });
    });

    router.post("/theses", function(request, result) {
        result.json({ message : "This is where you add a thesis",
                      data : "" + dbRequest.add(request.query, "thesis") });
    });

    router.get("/dbdump", function(request, result) {
        dbRequest.dump(function(results) {
            result.json({ message : "This is where I list everything in the db",
                          result : results });
        });
    });

    app.use("/", router);
    
    app.listen(port);
}());
