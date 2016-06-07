"use strict";

const sinon = require("sinon");

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

module.exports.sandboxThesisCtrlSaveOne = () => {
  let sandbox = sinon.sandbox.create();

  sandbox.stub(Thesis, "saveOne", (reqbody) => {
    return Promise.resolve(mockDB.thesis);
  });
  sandbox.stub(Thesis, "findAll", () => {
    return Promise.resolve(mockDB.theses);
  });
  sandbox.stub(Thesis, "findAllByUserRole", () => {
    return Promise.resolve(mockDB.theses);
  });
  sandbox.stub(Thesis, "findOne", () => {
    return Promise.resolve(mockDB.thesis);
  });
  sandbox.stub(ThesisProgress, "saveOne", (reqbody) => {
    return Promise.resolve(mockDB.thesisprogresses[0]);
  });
  sandbox.stub(ThesisProgress, "changeGraderStatus", (thesisId) => {
    return Promise.resolve();
  });
  sandbox.stub(CouncilMeeting, "findOne", (reqbody) => {
    return Promise.resolve(mockDB.councilmeeting);
  });
  sandbox.stub(CouncilMeeting, "saveOne", (reqbody) => {
    return Promise.resolve(mockDB.councilmeeting);
  });
  sandbox.stub(CouncilMeeting, "findAll", (reqbody) => {
    return Promise.resolve(mockDB.councilmeetings);
  });
  sandbox.stub(CouncilMeeting, "linkThesisToCouncilMeeting", () => {
    return Promise.resolve();
  });
  sandbox.stub(Grader, "linkThesisToGraders", () => {
    return Promise.resolve();
  });
  sandbox.stub(Grader, "saveOne", (reqbody) => {
    return Promise.resolve();
  });
  sandbox.stub(EthesisToken, "saveOne", (reqbody) => {
    return Promise.resolve();
  });
  sandbox.stub(Thesis, "addUser", (reqbody) => {
    return Promise.resolve(mockDB.users[0]);
  });

  return sandbox;
};

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

module.exports.unstubAll = () => {
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
