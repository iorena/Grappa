const fs = require("fs");
const path = require("path");

const moment = require("moment");
const mkdirp = require("mkdirp");
const PDF = require("pdfkit");
// const phantomjs = require("phantomjs-prebuilt");
const phantomjs = require("phantomjs");
const ejs = require("ejs");
const request = require("request");
const exec = require("child_process").exec;

const FileManipulator = require("./FileManipulator");
const ThesisAbstract = require("../models/ThesisAbstract");

const errors = require("../config/errors");

/**
 * Service that manipulates and creates PDF files.
 *
 * Used by thesisController to do stuff with the pdfs.
 * Has some nasty methods that maybe should be splitted for the sake of my burning eyes!
 */
class PdfManipulator {
  /**
   * Writes the PDF-stream to disk, copies 2nd page from it and sets the folder for deletion.
   *
   * @param {Buffer} thesisPDF - Thesis as Buffer-stream in PDF-format.
   * @return {Promise<String>} - Promise of the absolute path to the file.
   */
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
        FileManipulator.deleteFolderTimer(pathToFolder, 30000);
        return newPath;
      });
  }

  /**
   * Counts the number of pages of a PDF document.
   * @param {String} pathToFile - Absolute path to the file.
   * @return {Promise<String>} - Promise of the nummber of files as a string.
   */
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

  /**
   * Copies a given page from a given file.
   * @param {Number} pageNumber - Number of the page.
   * @param {String} pathToFile - Absolute path to the file.
   * @param {String} pathToTargetFile - Absolute path to the to-be-created file.
   * @return {Promise<String>} - Promise of the absolute path to the created file.
   */
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

  /**
   * Creates a PDF file consisting of professor's grader evaluation.
   * @param {Object} thesis - Thesis object from database.
   * @param {Array} professors - Current active and non-retired professors.
   * @param {String} pathToFile - Absolute path to the file.
   * @return {Promise<Void>} - Promise that resolves when the file is created.
   */
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

  gradersToString(graders) {
    return graders.reduce((accumulated, current, index) => {
      if (accumulated) {
        return `${accumulated}, ${current.name}`;
      } else {
        return `${current.name}`;
      }
    }, "")
  }

  /**
   * Removes unnecessary attributes and returns an array of 8-length arrays of theses.
   * 8 length because that's all the theses that can fit the cover page.
   */
  pruneAndSliceTheses(theses) {
    return theses.reduce((accumulated, current, index) => {
      const thesis = {
        authorFirstname: current.authorFirstname,
        authorLastname: current.authorLastname,
        title: current.title,
        grade: current.grade,
        graders: this.gradersToString(current.Graders),
      };
      if (index === 0 || index % 8 === 0) {
        accumulated.push([]);
      }
      accumulated[accumulated.length - 1].push(thesis);
      return accumulated;
    }, []);
  }

  /**
   * Creates a cover for the councilmeeting's documents as required by Pirjo.
   *
   * Consists of a list of the thesis processed in the meeting with author's name,
   * instructor's name and thesis' grade.
   * @param {String} pathToFolder - Absolute path to the folder where files will be created.
   * @param {Array<Object>} theses - Array of thesis objects.
   * @param {Object} councilmeeting - CouncilMeeting object fetched from the DB.
   * @return {Promise<Array>} Array of something??? TODO
   */
  generateThesesCover(pathToFolder, theses, councilmeeting) {
    let pages;
    return FileManipulator.readFileToBuffer(path.join(__dirname, "../config/phantomjs/cover.html"))
      .then(buffer => {
        const prunedTheses = this.pruneAndSliceTheses(theses);
        return Promise.all(prunedTheses.map((thesisArray, index) => {
          pages = index + 1;
          const html = ejs.render(buffer.toString(),
            {
              councilmeeting: {
                date: moment(councilmeeting.date).format("DD/MM/YYYY"),
                // no meeting number displayed since sometimes it is incorrect due to changes to meetings
                // no: `KK ${councilmeeting.seq}/${councilmeeting.date.getFullYear()}`,
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
          // console.log("yo executing phantomjs")
          const pathToCmd = path.join(__dirname, "../config/phantomjs/createCover.phantom.js");
          const cmd = `${phantomjs.path} ${pathToCmd} ${pathToFolder} ${pages}`;
          const child = exec(cmd, function (err, stdout, stderr) {
            if (err) {
              console.error(err);
              reject(new errors.BadRequestError("Phantomjs library failed to create pdf-document."));
            } else {
              // console.log("was success!", stdout)
              resolve(pages);
            }
          });
        });
      })
  }

  /**
   * Joins the PDF-files into a single file
   * @param {String} pathToFolder - Absolute path to the file.
   * @param {Array<String>} fileNames - Array of files to be joined.
   * @return {Promise<String>} Promise of the absolute path to the created file.
   */
  joinPdfs(pathToFolder, fileNames) {
    return new Promise((resolve, reject) => {
      // const pdfs = path.join(pathToFolder, "/*.pdf");
      const pdfs = fileNames.reduce((accumulated, current) => {
        accumulated += " " + current;
        return accumulated;
      }, "")
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

  /**
   * Generates PDF-files from each thesis' abstract, review and grader evalution.
   *
   * @param {Array<Object>} theses - Array of theses fetched from DB.
   * @param {Array<Object>} professors - Array of users fetched from DB.
   * @param {Object} councilmeeting - CouncilMeeting object fetched from DB.
   * @return {Promise<String>} - Promise of the absolute path to the created PDF-file.
   */
  generatePdfFromTheses(theses, professors, councilmeeting) {
    const docName = Date.now();
    let pathToFolder;
    let order = 1;
    const pdfFileNames = [];
    return FileManipulator.createFolder(docName)
      .then((newPath) => {
        pathToFolder = newPath;
        if (councilmeeting) {
          return this.generateThesesCover(pathToFolder, theses, councilmeeting);
        } else {
          return Promise.resolve();
        }
      })
      .then((coverPages) => {
        for (let i = 1; i <= coverPages; i++){
          pdfFileNames.push(path.join(pathToFolder, `0-${i}.cover.pdf`));
        }
        return Promise.all(theses.map(thesis => {
          let pdfs = [];
          if (thesis.ThesisAbstract) {
            pdfFileNames.push(path.join(pathToFolder, `${order}-1.abstract.pdf`));
            pdfs.push(FileManipulator.writeFile(`${pathToFolder}/${order}-1.abstract.pdf`, thesis.ThesisAbstract.pdf, "base64"));
          }
          if (thesis.ThesisReview) {
            pdfFileNames.push(path.join(pathToFolder, `${order}-2.review.pdf`));
            pdfs.push(FileManipulator.writeFile(`${pathToFolder}/${order}-2.review.pdf`, thesis.ThesisReview.pdf, "base64"));
          }
          if (thesis.graderEval && thesis.graderEval.length !== 0) {
            pdfFileNames.push(path.join(pathToFolder, `${order}-3.graderEval.pdf`));
            pdfs.push(this.generatePdfFromGraderEval(thesis, professors, `${pathToFolder}/${order}-3`));
          }
          order++;
          return Promise.all(pdfs);
        }));
      })
      .then(() => {
        return this.joinPdfs(pathToFolder, pdfFileNames);
      })
      .then((pathToPrintFile) => {
        FileManipulator.deleteFolderTimer(pathToFolder, 10000);
        return pathToPrintFile;
      });
  }
}

module.exports = new PdfManipulator();
