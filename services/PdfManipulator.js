"use strict";

const fs = require("fs");
const path = require("path");
const request = require("request");
const exec = require('child_process').exec;

class PdfManipulator {
  constructor() {
    this.outputPath = path.join(__dirname, "../pdf/");
    this.tempPath = path.join(__dirname, "../tmp/");
  }

  cleanFolder() {
    fs
    .readdirSync(this.outputPath)
    .map(file => fs.unlinkSync(this.outputPath + file))
  }

  downloadPdf(url, name) {
    return new Promise((resolve, reject) => {
      request(url)
        .pipe(fs.createWriteStream(this.outputPath + name + ".pdf"))
        .on("close", function(error) {
          if (error) reject(error);
          resolve();
        })
    })
  }

  copyPageFromPdf(pageNumber, name) {
    return new Promise((resolve, reject) => {
      const pathToPdf = this.outputPath + name + '.pdf';
      const pathToOutput = this.outputPath + name + '.abstract.pdf';
      const cmd = `pdftk ${pathToPdf} cat ${pageNumber}-${pageNumber} output ${pathToOutput}`;
      const child = exec(cmd, function (err, stdout, stderr) {
        if (err) reject(err);
        resolve();
      });
    })
  }

  joinPdfs() {
    return new Promise((resolve, reject) => {
      const cmd = `pdftk ${this.outputPath}*.abstract.pdf cat output ${this.tempPath}print.pdf`;
      const child = exec(cmd, function (err, stdout, stderr) {
        if (err) reject(err);
        resolve();
      });
    })
  }

  fetchAbstractForThesis(thesis) {
    const name = Date.now();
    return this.downloadPdf(thesis.ethesis, name)
      .then(() => this.copyPageFromPdf(2, name))
  }

  fetchAbstractsForTheses(theses) {
    this.cleanFolder();
    return Promise.all(theses.map(thesis => thesis.fetchAbstractForThesis(thesis)))
      .then(() => this.joinPdfs())
      .then(() => {
        console.log("abstracts prepared, Sir!")
      })
  }

  prepareAbstractsForMeeting() {
    const name = Date.now();
    this.cleanFolder();
    return this.downloadPdf("https://helda.helsinki.fi/bitstream/handle/10138/161386/ProGraduOjanen.pdf?sequence=1", name)
      .then(() => this.copyPageFromPdf(2, name))
      .then(() => this.joinPdfs())
      .then(() => {
        console.log("abstracts prepared, Sir!")
      })
  }
}

module.exports = new PdfManipulator();
