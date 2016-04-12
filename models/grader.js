"use strict";

const BaseModel = require("./base_model");
const tables = require("./tables.js");

class Grader extends BaseModel {
  constructor() {
    super("Grader");
  }

  findOrCreate(grader, gradertitle){
    tables.Grader
    .findOne({where: {name: grader, title: gradertitle}})
    .then((graders) => {
      if(graders === null){
        return tables.Grader.create({name: grader, title: gradertitle})
      } else {
        return graders;
      }
    })
  }

  saveIfDoesntExist(thesis) {
    let queries = [];
    queries.push(this.findOrCreate(thesis.grader, thesis.gradertitle));
    queries.push(this.findOrCreate(thesis.grader2, thesis.grader2title));
    return Promise.all(queries);
  }
}



module.exports.class = Grader;
module.exports = new Grader();
