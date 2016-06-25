"use strict";

const fs = require("fs");
const path = require("path");
const PDF = require("pdfkit");
const request = require("request");
const exec = require("child_process").exec;

class PdfManipulator {
  constructor() {
    this.tmpPath = path.join(__dirname, "../tmp/");
  }

  cleanTmpFolder() {
    fs
    .readdirSync(this.tmpPath)
    .map(file => fs.unlinkSync(this.tmpPath + file));
  }

  deleteFolder(pathToFolder) {
    fs
    .readdirSync(pathToFolder)
    .map(file => fs.unlinkSync(this.tmpPath + file));

    fs
    .rmddir(pathToFolder);
  }

  generateGraderEval() {
    const doc = new PDF();

    doc
    .fontSize(14)
    .text("Title: ")
    .moveDown()
    .text("Author: ")
    .moveDown()
    .text("Instructor:")
    .moveDown()
    .text("Intended date for councilmeeting:")
    .moveDown();

    doc.end();
    return doc;
  }

  downloadPdf(url, name) {
    return new Promise((resolve, reject) => {
      request(url)
        .pipe(fs.createWriteStream(this.tmpPath + name + ".pdf"))
        .on("close", function (error) {
          if (error) reject(error);
          resolve();
        });
    });
  }

  copyPageFromPdf(pageNumber, name) {
    return new Promise((resolve, reject) => {
      const pathToPdf = this.tmpPath + name + ".pdf";
      const pathToOutput = this.tmpPath + name + ".abstract.pdf";
      const cmd = `pdftk ${pathToPdf} cat ${pageNumber}-${pageNumber} output ${pathToOutput}`;
      const child = exec(cmd, function (err, stdout, stderr) {
        if (err) reject(err);
        resolve();
      });
    });
  }

// joinPdfsInsideTmp
// or pathToFolder as parameter?
  joinPdfs() {
    return new Promise((resolve, reject) => {
      const cmd = `pdftk ${this.tmpPath}*.abstract.pdf cat output ${this.tempPath}print.pdf`;
      const child = exec(cmd, function (err, stdout, stderr) {
        if (err) reject(err);
        resolve();
      });
    });
  }

// downloadEthesisAndCopyAbstract
  fetchAbstractForThesis(thesis) {
    const name = Date.now();
    return this.downloadPdf(thesis.ethesis, name)
      .then(() => this.copyPageFromPdf(2, name));
  }

  fetchAbstractsForTheses(theses) {
    const tmpFolderName = Date.now();
    // this.createFolder(this.pathToTmp + tmpFolderName);
    this.cleanTmpFolder();
    return Promise.all(theses.map(thesis => thesis.fetchAbstractForThesis(thesis)))
      .then(() => this.joinPdfs())
      .then(() => {
        // this.deleteFolder(this.pathToTmp + tmpFolderName);
        console.log("abstracts prepared, Sir!");
      });
  }

  prepareAbstractsForMeeting() {
    const name = Date.now();
    this.cleanFolder();
    return this.downloadPdf("https://helda.helsinki.fi/bitstream/handle/10138/161386/ProGraduOjanen.pdf?sequence=1", name)
      .then(() => this.copyPageFromPdf(2, name))
      .then(() => this.joinPdfs())
      .then(() => {
        console.log("abstracts prepared, Sir!");
      });
  }
}

module.exports = new PdfManipulator();
