var express = require("express"),
    bodyParser = require("body-parser"),
    pg = require("pg"),
    app = express();

try {
    var config = require("../config.js");
} catch (e) {
    var config = {};
}
    
module.exports = (function() {

    var dburl = config.dburl || process.env.DATABASE_URL,
        port = config.port || process.env.PORT;

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
        result.json({ message : "This is where I list all the theses \o/" });
    });

    app.use("/", router);
    
    app.listen(port);

}());
