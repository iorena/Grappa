"use strict";

const fs = require("fs");

class FileUploader {
  parseUploadData(req, requiredExt) {
    const data = {
      id: "",
      file: "",
      ext: "",
    };
    return new Promise((resolve, reject) => {
      console.log("yo upload");
      req.pipe(req.busboy);
      req.busboy.on("error", (error) => {
        reject(error);
      })
      req.busboy.on('field', (key, value, keyTruncated, valueTruncated) => {
        console.log(`${key} : ${value}`);
        if (key === "id" && value) {
          data.id = value;
        }
      });
      req.busboy.on('file', (fieldname, file, filename) => {
        const ext = filename.substr(filename.lastIndexOf('.')+1);
        console.log(ext)
        if (filename && requiredExt === ext) {
          data.file = file;
          data.ext = ext;
          resolve(data);
        } else {
          console.log("Nothing to upload or wrong extension")
          reject();
        }
      });
    })
  }
  writeFile(file, ext) {
    return new Promise((resolve, reject) => {
      console.log("writing temp pdf");
      const fstream = fs.createWriteStream("./pdf/temp.pdf");
      file.pipe(fstream);
      fstream.on('close', () => {
        resolve();
      });
      fstream.on("error", err => {
        reject(err);
      })
    })
  }
}

module.exports = new FileUploader();