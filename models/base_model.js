"use strict";

const tables = require("./tables.js");

class BaseModel {
  constructor(tablename) {
    this.tablename = tablename;
    // Object.keys(argsObj).forEach((key,index) => {
    //   console.log("" + key + argsObj[key]);
    //   this.key = argsObj[key];
    // })
    // for(let key in argsObj) {
    //   this.key = argsObj[key];
    //   console.log(this.key + " "+ argsObj[key]);
    // }
    // for(const key in args) {
    //   this.args[key]. = args[key];
    // }
  }
  /*
   * Returns all the rows from a table.
   *
   * Basically SELECT * FROM @this.tablename
   *
   * @table {String} name of the table/model
   * @return Promise
   */
  findAll() {
    return tables[this.tablename].findAll();
  }
  /*
   * Creates new instance of table with validated(!) @params.
   *
   * Kinda like INSERT (@params) INTO @tablename RETURNING ID
   *
   * @tablename {String} name of the table/model
   * @params {Object} values to add
   * @return Promise
   */
  saveOne(params) {
    return tables[this.tablename].create(params);
  }
  drop() {
    return tables[this.tablename].destroy({ where: {} });
  }
}

module.exports = BaseModel;
