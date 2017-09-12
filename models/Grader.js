"use strict";

const BaseModel = require("./BaseModel");

class Grader extends BaseModel {
  constructor() {
    super("Grader");
  }

  saveOne(values) {
    return this.Models.Grader.create(values)
      .then(newGrader => {
        return {
          id: newGrader.id,
          name: newGrader.name,
          title: newGrader.title
        }
      });
  }

  findOne(params) {
    return this.Models[this.modelname]
      .findOne({
        attributes: ["id", "name", "title"],
        where: params,
      });
  }

  findAll() {
    return this.Models[this.modelname]
      .findAll({
        attributes: ["id", "name", "title"],
      });
  }

  updateGraderFromUser(user, title) {
    let name = user.firstname + " " + user.lastname;
    console.log(title);
    return this.Models.Grader
      .findOne({ where: { name } })
      .then(foundGrader => {
        if (!foundGrader && !title) {
          console.log("ADMIN NEEDS TO ADD " + name);
          //Someone doesn't have grader ready. Admin needs to add.
          return Promise.resolve();
        } else if (!foundGrader) {
          console.log("Created new! " + title + " " + name);
          return this.saveOne({ name, title });
        } else {
          console.log("Updated! " + name);
          return this.update({ name }, { id: foundGrader.id });
        } 
      })
  }

  updateOrCreateAndLinkToThesis(values, thesis) {
    return this.Models.Grader
      .findOne({ where: { id: values.id } })
      .then(foundGrader => {
        if (foundGrader === null) {
          return this.Models.Grader.create(values);
        } else {
          return this.Models.Grader.update(values, { where: { id: values.id } });
        }
      })
      .then(updatedGrader => updatedGrader.addThesis(thesis));
  }

  findOrCreate(grader) {
    return this.Models.Grader
      .findOne({ where: { name: grader.name, title: grader.title } })
      .then((newgrader) => {
        if (newgrader === null) {
          return this.Models.Grader.create({ name: grader.name, title: grader.title });
        }
        return newgrader;
      })
      .then(newGrader => {
        return {
          id: newGrader.id,
          name: newGrader.id,
          title: newGrader.title
        }
      })
  }

  linkThesisToGraders(graders, thesisId) {
    if (graders === undefined) {
      return Promise.resolve();
    }
    return Promise.all(graders.map(grader =>
      this.Models.Grader
        .findOne({
          where: { id: grader.id },
          include: [{
            model: this.Models.Thesis,
            as: "Theses",
          }]
        })
        .then(grader => {
          if (grader.Theses.findIndex(thesis => thesis.id === thesisId) === -1) {
            return grader.addThesis(thesisId);
          }
        })));
  }

  removeThesisFromOtherGraders(graders, thesisId) {
    return this.Models.GraderThesis.findAll({
      where: { ThesisId: thesisId }
    })
      .then(gradertheses => {
        const removeGraders = gradertheses.filter(table =>
          graders.findIndex(gra => table.GraderId === gra.id) === -1
        );
        return Promise.all(removeGraders.map(row => this.Models.GraderThesis.destroy({ where: { GraderId: row.GraderId, ThesisId: row.ThesisId } })));
      });
  }

  findOneWithTheses(grader) {
    return this.Models.Grader.findOne({
      where: { id: grader.id },
      include: [{
        model: this.Models.Thesis,
        as: "Theses",
      }]
    })
  }
}

module.exports = new Grader();
