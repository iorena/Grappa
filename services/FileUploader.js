"use strict";

const moment = require("moment");
const mkdirp = require("mkdirp");
const fs = require("fs");
const path = require("path");

class FileUploader {
  parseUploadData(req, requiredExt) {
    const parsedData = {
      id: "",
      file: "",
      ext: "",
    };
    const chunks = [];
    return new Promise((resolve, reject) => {
      // console.log("yo upload");
      req.pipe(req.busboy);
      req.busboy.on("error", (error) => {
        reject(error);
      });
      req.busboy.on("field", (key, value, keyTruncated, valueTruncated) => {
        console.log(`${key} : ${value}`);
        if (key === "id" && value) {
          parsedData.id = value;
        }
      });
      req.busboy.on("file", (fieldname, file, filename) => {
        const ext = filename.substr(filename.lastIndexOf(".") + 1);
        // console.log("File [" + fieldname + "]: filename: " + filename);
        if (filename === null && requiredExt !== ext) {
          reject();
        }
        file.on("data", (data) => {
          // console.log("File [" + fieldname + "] got " + data.length + " bytes");
          chunks.push(data);
        });
        file.on("end", () => {
          // parsedData.file = file;
          parsedData.file = Buffer.concat(chunks);
          parsedData.ext = ext;
          // console.log("File [" + fieldname + "] Finished");
        });
      });
      req.busboy.on("finish", () => {
        // console.log("finish busboy parsing")
        resolve(parsedData);
      });
    });
  }
  createThesisFolder(thesis) {
    console.log("luon kansion!");
    const date = moment(new Date()).format("DD.MM.YYYY");
    const dirName = `${thesis.authorLastname}-${thesis.authorFirstname}-${date}`;
    const pathToFolder = `./pdf/${dirName}`;
    // console.log(pathToFolder);
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

module.exports = new FileUploader();
