"use strict";

const ThesisController = require("../../controllers/thesis");

const Thesis = require("../../models/thesis");
const ThesisProgress = require("../../models/thesisprogress");
const CouncilMeeting = require("../../models/councilmeeting");
const Grader = require("../../models/grader");
const EthesisToken = require("../../models/ethesisToken");
const StudyField = require("../../models/studyfield");

const EmailReminder = require("../../services/EmailReminder");
const EmailSender = require("../../services/EmailSender");
const tokenGen = require("../../services/TokenGenerator");

const mockDB = require("../mockdata/database");

let stubbed = [];

module.exports.stubFunction = (path, functionName) => {
  const stub = sinon.stub(require(path), functionName, () => Promise.resolve());
  stubbed.push(stub);
  return stub;
};

module.exports.stubWithFunction = (path, functionName, stubFunction) => {
  const stub = sinon.stub(require(path), functionName, () => stubFunction);
  stubbed.push(stub);
  return stub;
};

module.exports.unstub = () => {
  stubbed = stubbed.map(stub => {
    stub.restore();
  });
};

module.exports.unstubSpecific = (path, functionName) => {
  stubbed = stubbed.filter(stub => {
    // TODO
    if (stub.name === functionName) {
      stub.restore();
    } else {
      return stub;
    }
  });
};
