"use strict";

const moment = require("moment");
const mkdirp = require("mkdirp");
const rmdir = require("rmdir");
const fs = require("fs");
const path = require("path");

/**
 * Service for wrapping used I/O methods inside a single file.
 * Maybe it should be a stateless object to really force the statelesness.
 * But oh well.
 */

class FileManipulator {

  createFolder(name) {
    if (!name) name = Date.now();
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

  deleteFolderTimer(wait, pathToFolder) {
    setTimeout(() => {
      this.deleteFolder(pathToFolder);
    }, wait);
  }
/* TODO This should be async */
  deleteFolder(pathToFolder) {
    fs
    .readdirSync(pathToFolder)
    .map(file => fs.unlinkSync(pathToFolder + "/" + file));

    fs
    .rmdirSync(pathToFolder);
  }

  cleanTmp() {
    const tmpPath = path.join(__dirname, "../tmp");

    try {
      rmdir(tmpPath);
    }
    catch (err) {
      console.log("Clean tmp ERROR");
      console.error(err);
    }
  }

  writeFile(pathToFile, file, encoding) {
    return new Promise((resolve, reject) => {
      fs.writeFile(pathToFile, file, encoding ? encoding : "utf8", (err) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          resolve(pathToFile);
        }
      });
    })
  }

  readFileToBuffer(pathToFile) {
    return new Promise((resolve, reject) => {
      fs.readFile(pathToFile, (err, data) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          resolve(data);
        }
      });
    })
  }

  pipeFileToResponse(pathToFile, fileType, fileName, res) {
    const file = fs.createReadStream(pathToFile);
    const stat = fs.statSync(pathToFile);
    res.setHeader("Content-Length", stat.size);
    res.setHeader("Content-Type", `application/${fileType}`);
    res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);
    file.pipe(res);
  }
}

module.exports = new FileManipulator();
