"use strict";

const request = require("request");
const expect = require("chai").expect;
const sinon = require("sinon");
const mockDB = require("../mockdata/database");

const Thesis = require("../../models/thesis");
const ThesisProgress = require("../../models/thesisprogress");
const ThesisProgressSeqModel = ThesisProgress.getModel();

var graderEval;
var changeGraderStatus;

describe("ThesisProgressController", () => {
  before (() => {
    changeGraderStatus = sinon.spy(ThesisProgress, "changeGraderStatus");
    graderEval = sinon.spy(ThesisProgress, "evaluateGraders");
    
    sinon.stub(Thesis, "findOne", () => {
      return Promise.resolve(mockDB.thesis);
    });
    sinon.stub(ThesisProgressSeqModel, "update", () => {
      return Promise.resolve();
    });
  })


  after (() => {
    ThesisProgress.evaluateGraders.restore();
    Thesis.findOne.restore();
    ThesisProgressSeqModel.update.restore();
  }) 

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
