const tables = require("./tables.js");

const async = require("async");

module.exports = {
  drop: (model) => {
    return tables[model].destroy({where: {}});
  },
  findAll: (model) => {
    return tables[model].findAll();
  },
  saveOne: (model, params) => {
    return tables[model].create(params);
  },
  /*
   * Makes an INSERT query to the specified @table
   *
   * @params object containing values to add
   * @table sql table to add into, mapping in tables.js
   *
   * should probably return some kind of "ok"/"error" message
   *
   */

  add: (params, table) => {
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

  list: function(params, table, callback) {
    tables[table].findAll({
      where: params,
      raw: true
    }).then(function(results) {
      callback(results);
    });
  },

  /*
   * Returns out all entries in all tables
   *
   * @callback function to be called when database queries are done
   *
   */


  /* will be used later
   findOne : function(params, table, callback){
      tables[table].findOne({where:params, raw:true}).then(function(result){
          callback(result);
      });
  },
  */
  dump: function(callback) {
    const results = [];
    async.forEachOf(tables, function(item, key, callback) {
      item.findAll({
        raw: true
      }).then(function(res) {
        results.push(res);
        console.log(results);
        callback();
      });
    }, function(err) {
      if (err) console.log(err);
      callback(results);
    });
  }
};
