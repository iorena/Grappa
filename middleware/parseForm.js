"use strict";

const errors = require("../config/errors");

/**
 * Middleware for parsing requests that are 'multipart/form-data'.
 *
 * Currently used solely for the uploading of thesis pdf-documents.
 */
module.exports.parseUpload = (maxMBFileSize) => (req, res, next) => {
  const parsedForm = {
    files: [],
    json: {},
  };
  const files = {};

  // TODO switch to multer or some other library as data other than multipart/form-data will crash this app
  // if (req.headers["content-type"].indexOf("multipart/form-data") === -1) {
  //   throw new errors.BadRequestError(`Request wasn't type multipart/form-data`);
  // }

  new Promise((resolve, reject) => {
    req.pipe(req.busboy);
    req.busboy.on("error", (error) => {
      reject(error);
    });
    req.busboy.on("field", (key, value, keyTruncated, valueTruncated) => {
      // console.log("yo field " + key)
      parsedForm[key] = value && key === "json" ? JSON.parse(value) : value;
    });
    req.busboy.on("file", (fieldname, file, filename) => {
      // console.log("file is " + fieldname)
      files[fieldname] = {};
      files[fieldname].chunks = [];
      files[fieldname].dataSize = 0;
      file.on("data", (data) => {
        // console.log("data from " + fieldname)
        files[fieldname].chunks.push(data);
        files[fieldname].dataSize += data.length;
        if (files[fieldname].dataSize > maxMBFileSize * 1000000) {
          reject(new errors.BadRequestError(`File was over ${maxMBFileSize} MB.`))
        }
      });
      file.on("end", () => {
        const file = {
          buffer: Buffer.concat(files[fieldname].chunks),
          ext: filename.substr(filename.lastIndexOf(".") + 1),
          filetype: fieldname,
        }
        // console.log("wat is fieldname: " + fieldname)
        // console.log("wat is size: " + file.buffer.length)
        file.size = file.buffer.length;
        parsedForm.files.push(file);
      });
    });
    req.busboy.on("finish", () => {
      // console.log("form: ", parsedForm)
      resolve(parsedForm);
    });
  })
  .then(data => {
    req.body = data;
    next();
  })
  .catch(err => next(err));
};
