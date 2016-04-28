"use strict";

const request = require("supertest");
const expect = require("chai").expect;
const sinon = require("sinon");

const app = require("../testhelper").app;

const mockDB = require("../mockdata/database");

const Thesis = require("../../models/thesis");
const ThesisProgress = require("../../models/thesisprogress");
const User = require("../../models/user");
const ThesisProgressSeqModel = ThesisProgress.getModel();

var graderEval;
var changeGraderStatus;

describe("ThesisProgress", () => {
  before(() => {
    changeGraderStatus = sinon.spy(ThesisProgress, "changeGraderStatus");
    graderEval = sinon.spy(ThesisProgress, "evaluateGraders");

    sinon.stub(Thesis, "findOne", () => {
      return Promise.resolve(mockDB.thesis);
    });
    sinon.stub(ThesisProgressSeqModel, "update", () => {
      return Promise.resolve();
    });
    sinon.stub(ThesisProgress, "findOne", () => {
      return Promise.resolve(mockDB.thesisprogresses[0]);
    });
    sinon.stub(User, "findOne", () => {
      return Promise.resolve(mockDB.users[0]);
    });
  });
  after(() => {
    ThesisProgress.evaluateGraders.restore();
    Thesis.findOne.restore();
    ThesisProgressSeqModel.update.restore();
    ThesisProgress.findOne.restore();
    User.findOne.restore();
  });

  describe("When adding a new thesisprogress", () => {


    it("graders should update if they are competent", () => {

      ThesisProgress.evaluateGraders(mockDB.thesis.id, mockDB.competentGraders);
      expect(graderEval.called).to.equal(true);
      expect(changeGraderStatus.calledOnce).to.equal(true);
      expect(changeGraderStatus.calledWith(mockDB.thesis.id)).to.equal(true);
    });
    it("should not update with shitty graders", () => {
      ThesisProgress.evaluateGraders(mockDB.thesis, mockDB.incompetentGraders);
      expect(changeGraderStatus.calledTwice).to.equal(false);
    });
  });
});
