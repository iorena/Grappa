"use strict";

const errors = require("../config/errors");

module.exports.parseUpload = (maxMBFileSize) => (req, res, next) => {
  const parsedForm = {
    files: [],
    json: {},
  };
  const files = {};

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
