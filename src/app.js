var express = require("express"),
    bodyParser = require("body-parser"),
    setImmediate = require("setimmediate"),
    app = express();
    
/* load route handlers */

var dbRequest = require("./dbRequest.js");

try {
    var config = require("../config.js");
} catch (e) {
    var config = {};
}
    
module.exports = (function() {

    var dburl = config.dburl || process.env.DATABASE_URL,
        port = 9876 || process.env.PORT;

    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());
    var router = express.Router();

    /* set the routes */

    router.get("/", function(request, result) {
        result.json({ message : "This is the default page. Nothing to see here" });
    });

    router.get("/theses", function(request, result) {
        result.json({ message : "This is where I list all the theses o/",
                      result : dbRequest.list(request.query, "theses") });
    });

    router.post("/theses", function(request, result) {
        result.json({ message : "I want to add a thesis here o/",
                      data : dbRequest.add(request.query, "theses") });
    });

    app.use("/", router);
    
    app.listen(port);
}());
