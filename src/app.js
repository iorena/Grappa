var express = require("express"),
    bodyParser = require("body-parser"),
    pg = require("pg"),
    setImmediate = require("setimmediate"),
    app = express();
    
/* load route handlers */

var getTheses = require("./getTheses.js"),
    postThesis = require("./postThesis.js");

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

    var dbclient = new pg.Client(dburl);
    dbclient.connect();
    dbclient.end();

    /* set the routes */

    router.get("/", function(request, result) {
        result.json({ message : "This is the default page. Nothing to see here" });
    });

    router.get("/theses", function(request, result) {
        result.json({ message : "This is where I list all the theses o/",
                      words : getTheses.get(request) });
    });

    router.post("/theses", function(request, result) {
        result.json({ message : "I want to add a thesis here o/",
                      data : getTheses.post(request) });
    });

    app.use("/", router);
    
    app.listen(port);
}());
