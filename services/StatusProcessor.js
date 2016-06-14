"use strict";

const fs = require("fs");
const path = require("path");
const request = require("request");
// const EmailReader = require("./EmailReader");
const EmailReminder = require("./EmailReminder");

const ThesisProgress = require("../models/ThesisProgress");
const Thesis = require("../models/Thesis");

class StatusProcessor {

  splitShit() {
    var exec = require('child_process').exec;
    var pathToPdf = path.join(__dirname, '../pdf/gradu.pdf');
    var pathToOutput = path.join(__dirname, "../pdf/output.pdf");
    var cmd = `pdftk ${pathToPdf} cat 2-2 output ${pathToOutput}`;
    var child = exec(cmd, function (err, stdout, stderr) {
      if (err) {
        console.log(err)
      } else {
        console.log("jepa");
      }
    });
  }

  joinPdfs() {
    const cmd = `pdftk *.pdf cat output newfile.pdf`;
  }

  fetchPageFromPdf(pdfUrl, page) {
    const file = fs.createWriteStream("temp.pdf");

    request.get({ url: pdfUrl }, (error, response, body) => {
      if (error) reject(error);

      resolve(body);
    })

    // request.get(pdfUrl).pipe(file).on('close', function () {
    //   postData(fs.readFileSync('temp.pdf'));
    // });
    // return new Promise((resolve, reject) => {
    //   request.get({ url: pdfUrl }, (error, response, body) => {
    //     if (error) reject(error);
    //     resolve(body);
    //   });
    // })
    // .then(body => {
    //   fs.createWriteStream("./peedeeäf");
    // })
  }

  fetchAbstract(ethesisUrl) {
    return new Promise((resolve, reject) => {
      request.get({ url: ethesisUrl }, (error, response, body) => {
        if (error) reject(error);
        const startI = body.indexOf("abstract-field");
        const endI = body.indexOf("</", startI);
        resolve(body.substring(startI + 16, endI));
      });
    });
  }

  processThesisStatus(thesis) {
    return this.checkForEthesis(thesis)
      .then(wasUpdated => {
        console.log(wasUpdated);
        if (wasUpdated) {
          // TODO isn't this kinda spamming?
          this.sendToPrintPerson(thesis);
        }
      });
  }
  /**
   * Check if ethesis link has been added, in which case fetch abstract
   */
  checkForEthesis(thesis) {
    if (thesis.ethesis !== null && thesis.abstract === null) {
      console.log("eThesis-link found on thesis but no abstract, fetching it from eThesis.com!");
      console.log(thesis.ethesis);
      return this.fetchAbstract(thesis.ethesis)
        .then((value) => Thesis.update({ abstract: value }, { id: thesis.id }))
        .then(() => { return true;});
    } else {
      console.log("Either no eThesis-link found or abstract already exists. No action will be taken.");
      return Promise.resolve(false);
    }
  }

  /*
   * Last step: ethesis link and abstract are in place and graders have been evaluated
   */
  sendToPrintPerson(thesis) {
    if (thesis.gradersStatus && thesis.abstract !== null && thesis.documentsSent === null) {
      EmailReminder.sendPrintPersonReminder(thesis);
      ThesisProgress.update({ documentsSent: Date.now() }, { id: thesis.id });
    }
  }
}

module.exports = new StatusProcessor();
