"use strict";

const tables = require("./tables.js");

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
