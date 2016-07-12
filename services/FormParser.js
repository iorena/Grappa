"use strict";

class FormParser {

  parseFormData(req) {
    const parsedForm = {};
    const chunks = [];
    return new Promise((resolve, reject) => {
      // console.log("yo upload");
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
        });
        file.on("end", () => {
          parsedForm.file = Buffer.concat(chunks);
          parsedForm.fileExt = filename.substr(filename.lastIndexOf(".") + 1);
        });
      });
      req.busboy.on("finish", () => {
        resolve(parsedForm);
      });
    });
  }
}

module.exports = new FormParser();
