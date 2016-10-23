"use strict";

const errors = require("../config/errors");

module.exports.parseUpload = (maxFileSize) => (req, res, next) => {
  const parsedForm = {};
  const chunks = [];
  let dataSize = 0;

  new Promise((resolve, reject) => {
    req.pipe(req.busboy);
    req.busboy.on("error", (error) => {
      reject(error);
    });
    req.busboy.on("field", (key, value, keyTruncated, valueTruncated) => {
      // console.log(`${key} : ${value}`);
      parsedForm[key] = JSON.parse(value);
    });
    req.busboy.on("file", (fieldname, file, filename) => {
      file.on("data", (data) => {
        chunks.push(data);
        dataSize += data.length;
        if (dataSize > maxFileSize * 1000000) {
          reject(new errors.BadRequestError(`File was over ${maxFileSize} MB.`))
        }
      });
      file.on("end", () => {
        parsedForm.file = Buffer.concat(chunks);
        parsedForm.fileExt = filename.substr(filename.lastIndexOf(".") + 1);
      });
    });
    req.busboy.on("finish", () => {
      resolve(parsedForm);
    });
  })
  .then(data => {
    req.body = data;
    next();
  })
  .catch(err => next(err));
};
