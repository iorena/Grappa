"use strict";

const moment = require("moment");
const mkdirp = require("mkdirp");
const rmdir = require("rmdir");
const fs = require("fs");
const path = require("path");

class FileManipulator {

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

  cleanTmp() {
    const tmpPath = path.join(__dirname, "../tmp");

    try{
      rmdir(tmpPath);
    }
    catch(err) {
      console.log("Clean tmp ERROR")
      console.error(err)
    }
  }

  writeFile(pathToFile, file) {
    return new Promise((resolve, reject) => {
      console.log("writing pdf file: " + pathToFile);
      fs.writeFile(pathToFile, file, (err) => {
        if (err) reject(err);
        resolve();
      });
    });
  }
}

module.exports = new FileManipulator();
