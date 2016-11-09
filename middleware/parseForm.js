"use strict";

const errors = require("../config/errors");

module.exports.parseUpload = (maxMBFileSize) => (req, res, next) => {
  const parsedForm = {
    files: [],
    json: {},
  };
  let filetypes = [];
  let chunks = [];
  let dataSize = 0;

  new Promise((resolve, reject) => {
    req.pipe(req.busboy);
    req.busboy.on("error", (error) => {
      reject(error);
    });
    req.busboy.on("field", (key, value, keyTruncated, valueTruncated) => {
      // console.log("yo field " + key)
      if (key === "filetype") {
        filetypes.push(value);
      } else {
        parsedForm[key] = value && key === "json" ? JSON.parse(value) : value;
      }
    });
    req.busboy.on("file", (fieldname, file, filename) => {
      chunks = [];
      // console.log("field: ", fieldname)
      file.on("data", (data) => {
        chunks.push(data);
        dataSize += data.length;
        if (dataSize > maxMBFileSize * 1000000) {
          reject(new errors.BadRequestError(`File was over ${maxFileSize} MB.`))
        }
      });
      file.on("end", () => {
        const file = {
          file: Buffer.concat(chunks),
          ext: filename.substr(filename.lastIndexOf(".") + 1),
          filetype: filetypes.splice(0, 1)[0],
        }
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
