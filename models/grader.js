"use strict";

const BaseModel = require("./base_model");
const tables = require("./tables.js");

class Grader extends BaseModel {
  constructor() {
    super("Grader");
  }

  findOrCreate(gradername, gradertitle){
    tables.Grader
    .findOne({where: {name: gradername, title: gradertitle}})
    .then((grader) => {
      if(grader === null){
        return tables.Grader.create({name: gradername, title: gradertitle})
      } else {
        return grader;
      }
    })
  }

  saveIfDoesntExist(thesis) {
    let queries = [];
    queries.push(this.findOrCreate(thesis.grader, thesis.gradertitle));
    queries.push(this.findOrCreate(thesis.grader2, thesis.grader2title));
    return Promise.all(queries);
  }

  linkGraderAndThesis(graderName, title, thesis)  {
    this
    .getModel()
    .findOne({where: {name: graderName, title: title}})
    .then(function(grader){
      grader
      .addThesis(thesis)
      .then(function(){
        console.log("Thesis and Grader added to GraderTheses");
      })
    })
  }
}

module.exports.class = Grader;
module.exports = new Grader();
module.exports.getModel = () =>{
  return BaseModel.tables.Grader;
};
