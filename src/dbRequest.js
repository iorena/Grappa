var dbUrl = process.env.DATABASE_URL;
var tables = require("../sql/tables.js");
var Sequelize = require("sequelize");

var seq = new Sequelize(dbUrl, { dialectOptions: { ssl: true } });

function stringify(obj) {
    return JSON.stringify(obj, function(key, value) {
        return value;
    }, 2); 
}

module.exports = {

    /*
     * Makes an INSERT query to the specified @table
     *
     * @params object containing values to add
     * @table sql table to add into, mapping in tables.js
     *
     * doesn't @return anything atm, should add
     */

    add : function(params, table) {
        tables[table].create(params);
    },

    /*
     * Makes a SELECT query to the specified @table
     *
     * @params filter parameters
     * @table sql table (name of model)
     *
     * @return list of db objects
     */

    list : function(params, table, callback) {
        tables[table].findAll({where:params, raw: true}).then(function(results) {
            callback(results.map(x => x.dataValues));
        });
    },

    /* this doesn't work yet */ 
    dump : function(callback) {
        var res = [];
        for (var model in tables)
        {
            tables[model].findAll().then(function(results)
            {
                res.push(results.map(x => stringify(x.dataValues)));
            });
        }
        callback(res);
    }
};
