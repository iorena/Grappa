"use strict";

const ValidationError = require("../config/errors").ValidationError;

class FormParser {

  parseFormData(req) {
    const parsedForm = {};
    const chunks = [];
    let dataSize = 0;
    return new Promise((resolve, reject) => {
      req.pipe(req.busboy);
      req.busboy.on("error", (error) => {
        reject(error);
      });
      req.busboy.on("field", (key, value, keyTruncated, valueTruncated) => {
        // console.log(`${key} : ${value}`);
        parsedForm[key] = value;
      });
      req.busboy.on("file", (fieldname, file, filename) => {
        file.on("data", (data) => {
          chunks.push(data);
          dataSize += data.length;
          if (dataSize > 1000000) {
            reject("MaxFileSize");
          }
        });
        file.on("end", () => {
          parsedForm.file = Buffer.concat(chunks);
          parsedForm.fileExt = filename.substr(filename.lastIndexOf(".") + 1);
        });
      });
      req.busboy.on("finish", () => {
        // console.log("finish parseFormData")
        resolve(parsedForm);
      });
    })
    .catch(err => {
      if (err === "MaxFileSize") {
        throw new ValidationError("File was over 1 MB");
      } else {
        throw err;
      }
    })
  }
}

module.exports = new FormParser();
