"use strict";

const fs = require("fs");
const path = require("path");

const mkdirp = require("mkdirp");
const PDF = require("pdfkit");
const request = require("request");
const exec = require("child_process").exec;

const FileManipulator = require("./FileManipulator");
const ThesisAbstract = require("../models/ThesisAbstract");

const errors = require("../config/errors");

class PdfManipulator {

  parseAbstractFromThesisPDF(thesisPDF) {
    const docName = Date.now();
    let pathToFolder;
    let pathToFile;
    return FileManipulator.createFolder(docName)
      .then((newPath) => {
        pathToFolder = newPath;
        return this.saveBase64FileToPath(thesisPDF, path.join(pathToFolder, "/thesis.pdf"));
      })
      .then((newPath) => {
        pathToFile = newPath;
        return this.getPdfDocumentPages(pathToFile);
        // console.log("path: " + newPath)
        // return this.copyPageFromPDF(2, pathToFile, path.join(pathToFolder, "/abstract.pdf"));
      })
      .then(pages => {
        if (pages > 1) {
          return this.copyPageFromPDF(2, pathToFile, `${pathToFolder}/abstract.pdf`);
        } else {
          throw new errors.BadRequestError("Thesis had less than 2 pages.");
        }
      })
      .then((path) => {
        FileManipulator.deleteFolderTimer(30000, pathToFolder);
        return path;
      });
  }
/* move to FileManipulator */
  saveBase64FileToPath(readStream, pathToFile) {
    return new Promise((resolve, reject) => {
      fs.writeFile(`${pathToFile}`, readStream, "base64", err => {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          resolve(pathToFile);
        }
      });
    });
  }

  getPdfDocumentPages(pathToFile) {
    return new Promise((resolve, reject) => {
      const cmd = `pdftk ${pathToFile} dump_data | grep NumberOfPages | awk '{print $2}`;
      const child = exec(cmd, function (err, stdout, stderr) {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          console.log("pages: " + stdout)
          resolve(stdout);
        }
      });
    });
  }

  copyPageFromPDF(pageNumber, pathToFile, pathToTargetFile) {
    return new Promise((resolve, reject) => {
      const cmd = `pdftk ${pathToFile} cat ${pageNumber}-${pageNumber} output ${pathToTargetFile}`;
      const child = exec(cmd, function (err, stdout, stderr) {
        if (err) {
          console.error(err);
          console.log("RIP")
          reject(new errors.BadRequestError("Pdftk library failed to read thesis pdf-document."));
          // reject(err);
        } else {
          resolve(pathToTargetFile);
        }
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
    return FileManipulator.createFolder(docName)
      .then((path) => {
        pathToFolder = path;
        return Promise.all(theses.map(thesis => {
          let pdfs = [];
          if (thesis.ThesisAbstract) {
            pdfs.push(FileManipulator.writeFile(`${pathToFolder}/${order}-1.abstract.pdf`, thesis.ThesisAbstract.pdf));
          }
          if (thesis.ThesisReview) {
            pdfs.push(FileManipulator.writeFile(`${pathToFolder}/${order}-2.review.pdf`, thesis.ThesisReview.pdf));
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
        FileManipulator.deleteFolderTimer(10000, pathToFolder);
        return pathToPrintFile;
      });
  }
}

module.exports = new PdfManipulator();
