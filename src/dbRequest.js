var dbUrl = process.env.DATABASE_URL;
var Sequelize = require("sequelize");

var seq = new Sequelize(dbUrl);

/* define models here */

module.exports = {

    add : function(params, table) {
        //sequelize.create(params);
    },

    list : function(params, table) {

    }

};
