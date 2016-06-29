"use strict";

const fs = require("fs");
const path = require("path");

const mkdirp = require("mkdirp");
const PDF = require("pdfkit");
const request = require("request");
const exec = require("child_process").exec;

class PdfManipulator {
  constructor() {
    this.tmpPath = path.join(__dirname, "../tmp/");
  }

  createFolder(name) {
    const pathToFolder = path.join(__dirname, `../tmp/${name}`);
    return new Promise((resolve, reject) => {
      mkdirp(pathToFolder, (err) => {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          resolve(pathToFolder);
        }
      });
    });
  }

  generatePdfFromReview(review, pathToFile) {
    return new Promise((resolve, reject) => {
      fs.writeFile(`${pathToFile}.review.pdf`, review, "base64", err => {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          resolve();
        }
      });
    })
  }

  downloadEthesisPdf(url, pathToFile) {
    return new Promise((resolve, reject) => {
      request(url)
        .pipe(fs.createWriteStream(pathToFile))
        .on("close", (err) => {
          if (err) {
            console.error(err);
            reject(err);
          } else {
            resolve();
          }
        });
    });
  }

  copyAbstractFromEthesis(pageNumber, pathToFile) {
    return new Promise((resolve, reject) => {
      const pathToOutput = `${pathToFile}.abstract.pdf`;
      const cmd = `pdftk ${pathToFile}.ethesis.pdf cat ${pageNumber}-${pageNumber} output ${pathToOutput}`;
      const child = exec(cmd, function (err, stdout, stderr) {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  generatePdfFromEthesis(url, pathToFile) {
    return this.downloadEthesisPdf(url, `${pathToFile}.ethesis.pdf`)
      .then(() => this.copyAbstractFromEthesis(2, pathToFile))
      .then(() => {
        return new Promise((resolve, reject) => {
          fs.unlink(`${pathToFile}.ethesis.pdf`, (err) => {
            if (err) {
              console.error(err);
              reject(err);
            } else {
              resolve();
            }
          });
        });
      })
  }

  joinPdfs(pathToFolder) {
    return new Promise((resolve, reject) => {
      const pdfs = path.join(pathToFolder, "/*.pdf");
      const output = path.join(pathToFolder, "/print.pdf");
      const cmd = `pdftk ${pdfs} cat output ${output}`;
      const child = exec(cmd, function (err, stdout, stderr) {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          resolve(output);
        }
      });
    });
  }

  generatePdfFromTheses(theses) {
    const docName = Date.now();
    let pathToFolder;
    let order = 1;
    return this.createFolder(docName)
      .then((path) => {
        pathToFolder = path;
        return Promise.all(theses.map(thesis => {
          let pdfs = [];
          if (thesis.ethesis) {
            pdfs.push(this.generatePdfFromEthesis(thesis.ethesis, `${pathToFolder}/${order}-1`));
          }
          if (thesis.ThesisReview) {
            pdfs.push(this.generatePdfFromReview(thesis.ThesisReview.pdf, `${pathToFolder}/${order}-2`));
          }
          if (thesis.graderEval) {
            pdfs.push(this.generatePdfFromGraderEval(thesis.graderEval, docName));
          }
          order++;
          return Promise.all(pdfs);
        }))
      })
      .then(() => {
        return this.joinPdfs(pathToFolder);
      })
      .then((pathToPrintFile) => {
        return pathToPrintFile;
      })
  }

  // unchecked methods if necessary

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

// joinPdfsInsideTmp
// or pathToFolder as parameter?

  generatePdfFromGraderEval(graderEval, pdfName) {
    return new Promise((resolve, reject) => {
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
      fs.writeFile(`./tmp/${pdfName}.graderEval.pdf`, doc, "base64", err => {
        if (err) reject(err);
        resolve();
      });
    })
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
