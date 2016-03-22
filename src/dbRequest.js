var dbUrl = process.env.DATABASE_URL;
var tables = require("../sql/tables.js");

var Sequelize = require("sequelize");
var async = require("async");

var seq = new Sequelize(dbUrl, { dialectOptions: { ssl: true } });

module.exports = {

    /*
     * Makes an INSERT query to the specified @table
     *
     * @params object containing values to add
     * @table sql table to add into, mapping in tables.js
     *
     * should probably return some kind of "ok"/"error" message
     *
     */

    add : function(params, table) {
        tables[table].create(params);
    },

    /*
     * Makes a SELECT query to the specified @table
     *
     * @params filter parameters
     * @table sql table (name of model)
     * @callback function to be called when database query is done
     *
     */

    list : function(params, table, callback) {
        tables[table].findAll({where:params, raw: true}).then(function(results) {
            console.log(results);
            callback(results);
        });
    },

    /* this doesn't work yet
     *
     * @callback function to be called when database queries are done
     *
     */

    dump : function(callback) {
        async.map(Object.keys(tables), model => tables[model].findAll({raw: true}),
        function(err, results) {
            if (err) console.log(err);
            console.log(results);
            callback(results);
        });
    }
};
