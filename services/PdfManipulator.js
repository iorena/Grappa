"use strict";

const fs = require("fs");
const path = require("path");

const moment = require("moment");
const mkdirp = require("mkdirp");
const PDF = require("pdfkit");
const phantomjs = require("phantomjs-prebuilt");
const ejs = require("ejs");
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
        return FileManipulator.writeFile(path.join(pathToFolder, "thesis.pdf"), thesisPDF, "base64");
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
      .then((newPath) => {
        FileManipulator.deleteFolderTimer(30000, pathToFolder);
        return newPath;
      });
  }

  getPdfDocumentPages(pathToFile) {
    return new Promise((resolve, reject) => {
      const cmd = `pdftk ${pathToFile} dump_data | grep NumberOfPages | awk '{print $2}'`;
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

  generateThesisDocumentsCover(theses, pathToFolder) {
    return new Promise((resolve, reject) => {
      const pathToCmd = path.join(__dirname, "../config/phantomjs/createCover.phantom.js");
      const cmd = `${phantomjs.path} ${pathToCmd} penis`;
      const child = exec(cmd, function (err, stdout, stderr) {
        if (err) {
          console.error(err);
          reject(new errors.BadRequestError("Phantomjs library failed to create pdf-document."));
          // reject(err);
        } else {
          console.log("What is life?", stdout)
          resolve();
        }
      });
    });
  }

  gradersToString(graders) {
    return graders.reduce((accumulated, current, index) => {
      if (accumulated) {
        return `${accumulated}, ${current.name}`;
      } else {
        return `${current.name}`;
      }
    }, "")
  }

  pruneTheses(theses) {
    return theses.reduce((accumulated, current, index) => {
      const thesis = {
        authorFirstname: current.authorFirstname,
        authorLastname: current.authorLastname,
        title: current.title,
        grade: current.grade,
        graders: this.gradersToString(current.Graders),
      };
      if (index === 0 || index + 1 % 8 === 0) {
        accumulated.push([]);
      }
      accumulated[accumulated.length - 1].push(thesis);
      return accumulated;
    }, []);
  }

  asdf(pathToFolder, theses, councilmeeting) {
    let pages;
    return FileManipulator.readFileToBuffer(path.join(__dirname, "../config/phantomjs/cover.html"))
      .then(buffer => {
        const prunedTheses = this.pruneTheses(theses);
        return Promise.all(prunedTheses.map((thesisArray, index) => {
          pages = index + 1;
          const html = ejs.render(buffer.toString(),
            {
              councilmeeting: {
                date: moment(councilmeeting.date).format("DD/MM/YYYY"),
                no: `KK ${councilmeeting.seq}/${councilmeeting.date.getFullYear()}`,
              },
              theses: thesisArray,
              page: pages,
              maxPages: prunedTheses.length,
            }
          );
          return FileManipulator.writeFile(`${pathToFolder}/0-${pages}.cover.html`, html);
        }))
      })
      .then(() => {
        return new Promise((resolve, reject) => {
          console.log("yo executing phantomjs")
          const pathToCmd = path.join(__dirname, "../config/phantomjs/createCover.phantom.js");
          const cmd = `${phantomjs.path} ${pathToCmd} ${pathToFolder} ${pages}`;
          const child = exec(cmd, function (err, stdout, stderr) {
            if (err) {
              console.log("jaaa vituix meni")
              console.error(err);
              reject(new errors.BadRequestError("Phantomjs library failed to create pdf-document."));
            } else {
              console.log("was success!", stdout)
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

  generatePdfFromTheses(theses, professors, councilmeeting) {
    const docName = Date.now();
    let pathToFolder;
    let order = 1;
    return FileManipulator.createFolder(docName)
      .then((newPath) => {
        pathToFolder = newPath;
        // return Promise.resolve()
        return this.asdf(pathToFolder, theses, councilmeeting);
      })
      .then(() => {
        return Promise.all(theses.map(thesis => {
          let pdfs = [];
          if (thesis.ThesisAbstract) {
            pdfs.push(FileManipulator.writeFile(`${pathToFolder}/${order}-1.abstract.pdf`, thesis.ThesisAbstract.pdf, "base64"));
          }
          if (thesis.ThesisReview) {
            pdfs.push(FileManipulator.writeFile(`${pathToFolder}/${order}-2.review.pdf`, thesis.ThesisReview.pdf, "base64"));
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
        // FileManipulator.deleteFolderTimer(10000, pathToFolder);
        return pathToPrintFile;
      });
  }
}

module.exports = new PdfManipulator();
