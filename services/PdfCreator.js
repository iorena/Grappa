"use strict";

const PDF = require("pdfkit");

class PdfCreator {

  generateDoc(thesis) {
    const doc = new PDF();

    doc
    .text("Author: ")
    .text(`${thesis.author}, ${thesis.email}`)
    .moveDown()
    .text("Instructor:")
    .text(`${thesis.User.name}, ${thesis.User.email}`)
    .moveDown()
    .text(`Intended date for councilmeeting: ${this.dateFormatter(thesis.CouncilMeeting.date)}`)
    .moveDown();


    if (thesis.Graders.length > 0) {
      doc.text("Graders: ");
    }
    thesis.Graders.map((grader, i) => {
      doc
      .fontSize(10)
      .text(`${(i + 1)}.`)
      .text(grader.name)
      .text(grader.title)
      .moveDown();
    });


    if (thesis.graderEvaluation !== "") {
      doc.fontSize(9)
      .text("Evalutation of the graders by the professor in charge: ")
      .text(thesis.graderEvaluation)
      .moveDown();
    }


    doc.fontSize(9)
    .text("Abstract: ")
    .text(thesis.abstract)
    .moveDown();

    doc.end();
    return doc;
  }
  dateFormatter(date) {
    const origDate = new Date(date);
    return `${origDate.getDate()}/${origDate.getMonth()}/${origDate.getFullYear()}`;
  }
}

module.exports.class = PdfCreator;
module.exports = new PdfCreator();

