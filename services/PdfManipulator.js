"use strict";

const fs = require("fs");
const path = require("path");

const mkdirp = require("mkdirp");
const PDF = require("pdfkit");
const request = require("request");
const exec = require("child_process").exec;

class PdfManipulator {

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
    });
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
      });
  }

  generatePdfFromGraderEval(thesis, professors, pathToFile) {
    return new Promise((resolve, reject) => {
      const doc = new PDF();

      const graders = thesis.Graders.reduce((previousValue, current, index) => {
        if (index === 0) {
          return `${current.title} ${current.name}`;
        }
        return `${previousValue}, ${current.title} ${current.name}`;
      }, "");

      const professor = professors.find(prof => {
        if (prof.StudyFieldId === thesis.StudyFieldId) {
          return prof;
        }
      });
      const evaluator = professor ? `Professor ${professor.firstname} ${professor.lastname}` : "No professor assigned";

      doc
      .fontSize(12)
      .text(`Thesis: ${thesis.title}`)
      .moveDown()
      .text(`Graders: ${graders}`)
      .moveDown()
      .text(`Evaluator: ${evaluator}`)
      .moveDown()
      .text("Evaluation: ")
      .moveDown()
      .text(thesis.graderEval)
      .moveDown();

      const stream = doc.pipe(fs.createWriteStream(`${pathToFile}.graderEval.pdf`));

      doc.end();

      stream.on("finish", (err) => {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          resolve();
        }
      });
    });
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

  generatePdfFromTheses(theses, professors) {
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
            pdfs.push(this.generatePdfFromGraderEval(thesis, professors, `${pathToFolder}/${order}-3`));
          }
          order++;
          return Promise.all(pdfs);
        }));
      })
      .then(() => {
        return this.joinPdfs(pathToFolder);
      })
      .then((pathToPrintFile) => {
        this.deleteFolderTimer(10000, pathToFolder);
        return pathToPrintFile;
      });
  }

  deleteFolderTimer(wait, pathToFolder) {
    setTimeout(() => {
      this.deleteFolder(pathToFolder);
    }, wait);
  }

  deleteFolder(pathToFolder) {
    fs
    .readdirSync(pathToFolder)
    .map(file => fs.unlinkSync(pathToFolder + "/" + file));

    fs
    .rmdirSync(pathToFolder);
  }
}

module.exports = new PdfManipulator();
