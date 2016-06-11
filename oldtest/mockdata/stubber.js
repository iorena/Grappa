const Thesis = require("../../models/thesis");
const ThesisProgress = require("../../models/thesisprogress");

const stubbed = {
  Thesis: Thesis,
  ThesisProgres: ThesisProgress,
};

const mockDB = require("../mockdata/database");

module.exports.replace = (stubname, functionname, functionself, sandbox) => (
  sandbox.stub(stubbed.stubname, functionname, functionself)
);

module.exports.Thesis = (sandbox) => (
  {
    saveOne: sandbox.stub(Thesis, "saveOne", (reqbody) =>
      Promise.resolve(mockDB.thesis)
    ),
    findAll: sandbox.stub(Thesis, "findAll", () =>
      Promise.resolve(mockDB.theses)
    ),
    findAllByUserRole: sandbox.stub(Thesis, "findAllByUserRole", () =>
      Promise.resolve(mockDB.theses)
    ),
    findOne: sandbox.stub(Thesis, "findOne", () =>
      Promise.resolve(mockDB.thesis)
    ),
    linkStudyField: sandbox.stub(Thesis, "linkStudyField", (reqbody) =>
      Promise.resolve()
    ),
  }
);

module.exports.ThesisProgress = (sandbox) => (
  {
    saveOne: sandbox.stub(ThesisProgress, "saveOne", (reqbody) =>
      Promise.resolve(mockDB.thesisProgresses[0])
    ),
    findAll: sandbox.stub(ThesisProgress, "findAll", () =>
      Promise.resolve(mockDB.thesisProgresses)
    ),
    // findAllByUserRole: sandbox.stub(ThesisProgress, "findAllByUserRole", () =>
    //   Promise.resolve(mockDB.thesesProgresses)
    // ),
    findOne: sandbox.stub(ThesisProgress, "findOne", () =>
      Promise.resolve(mockDB.thesisProgress)
    ),
    isGraderEvaluationNeeded: sandbox.stub(ThesisProgress, "isGraderEvaluationNeeded", (thesisId, graders) =>
      false
    ),
    changeGraderStatus: sandbox.stub(ThesisProgress, "changeGraderStatus", (thesisId) =>
      Promise.resolve()
    ),
  }
);
