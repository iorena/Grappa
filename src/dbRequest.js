var dbUrl = process.env.DATABASE_URL;
var tables = require("../sql/tables.js");
var Sequelize = require("sequelize");

var seq = new Sequelize(dbUrl, { dialectOptions: { ssl: true } });

module.exports = {

    add : function(params, table) {
        tables[table].create(params);
    },

    list : function(params, table, callback) {
        tables[table].findAll({where:params}).then(function(results) {
            console.log(results);
            callback(results.map(x => JSON.stringify(x.dataValues)));
        });
    },
    /* this doesn't work yet */ 
    dump : function(callback) {
        var res = [];
        for (var model in tables)
        {
            tables[model].findAll().then(function(results)
            {
                res.push(results.dataValues);
                console.log(res);
            });
        }
        callback(res);
    }
};
