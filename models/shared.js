"use strict";

const tables = require("./tables.js");

module.exports = {
  drop: (model) => {
    return tables[model].destroy({where: {}});
  },
  /*
   * SELECT * FROM @table
   *
   * Returns all the rows from a @table.
   *
   * @table {String} name of the table/model
   * @return Promise
   */
  findAll: (model) => {
    return tables[model].findAll();
  },
  /*
   * INSERT (@params) INTO @table RETURNING ID
   *
   * Creates a new instance of @table from validated(!) @params.
   *
   * @table {String} name of the table/model
   * @params {Object} values to add
   * @return Promise
   */
  saveOne: (model, params) => {
    return tables[model].create(params);
  },
  /*
   * Returns out all entries in all tables
   *
   * @return Promise
   *
   */
  dump: function() {
    let queries = [];
    for(const key in tables) {
      queries.push(tables[key].findAll());
    }
    return Promise.all(queries);
  }
};
