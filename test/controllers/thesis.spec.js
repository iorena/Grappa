"use strict";

const request = require("supertest");
const expect = require("chai").expect;
const sinon = require("sinon");

const app = require("../testhelper").app;

const ThesisController = require("../../controllers/thesis");

const Thesis = require("../../models/thesis");
const ThesisProgress = require("../../models/thesisprogress");
const CouncilMeeting = require ("../../models/councilmeeting");
const Grader = require("../../models/grader");
const EthesisToken = require("../../models/ethesisToken");

const EmailReminder = require("../../services/EmailReminder");
const EmailSender = require("../../services/EmailSender");
const tokenGen = require("../../services/TokenGenerator");

const mockDB = require("../mockdata/database");

describe("ThesisController", () => {
  sinon.stub(Thesis, "saveOne", (reqbody) => {
    return Promise.resolve(mockDB.thesis);
  });
  sinon.stub(Thesis, "findAll", () => {
    return Promise.resolve(mockDB.theses);
  });
  sinon.stub(ThesisProgress, "saveOne", (reqbody) => {
    return Promise.resolve(mockDB.thesisprogresses[0])
  });
  sinon.stub(ThesisProgress, "evaluateGraders", () => {
    return Promise.resolve()
  });
  sinon.stub(CouncilMeeting, "findOne", (reqbody) => {
    return Promise.resolve(mockDB.councilmeeting);
  });
  sinon.stub(CouncilMeeting, "saveOne", (reqbody) => {
    return Promise.resolve(mockDB.councilmeeting)
  });
  sinon.stub(CouncilMeeting, "findAll", (reqbody) => {
    return Promise.resolve(mockDB.councilmeetings)
  });
  sinon.stub(CouncilMeeting, "linkThesisToCouncilMeeting", () => {
    return Promise.resolve()
  });
  var findOrCreateGrader = sinon.stub(Grader, "findOrCreate", () => {
    return Promise.resolve()
  })
  sinon.stub(Grader, "linkThesisToGraders", () => {
    return Promise.resolve()
  });
  sinon.stub(Grader, "saveOne", (reqbody) => {
    return Promise.resolve()
  });
  sinon.stub(EthesisToken, "saveOne", (reqbody) => {
    return Promise.resolve()
  });
  var sendStudentReminder = sinon.stub(EmailReminder, "sendStudentReminder", (reqbody) => {
    return Promise.resolve()
  });

  describe("GET /thesis (findAll)", () => {
    it("should call Thesis-model correctly and return theses", (done) => {
      sinon.stub(Thesis, "findAllByUserRole", () => {
        return Promise.resolve(mockDB.theses);
      });
      request(app)
      .get("/thesis")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200, mockDB.theses, done);
    })
  })
  describe("POST /thesis (saveOne)", () => {
    it("should save thesis and return thesis", (done) => {



      request(app)
      .post("/thesis")
      .send({ name: "thesis to be saved"})
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200, mockDB.thesis, done);
    });

    it('should add correct new thesisprogress', (done) => {
     let saveFromNewThesis = sinon.spy(ThesisProgress, "saveFromNewThesis");

     request(app)
     .post("/thesis")
     .send({ name: "thesis to be saved"})
     .set("Accept", "application/json")
     .expect("Content-Type", /json/)
     .expect(res => {
      expect(saveFromNewThesis.calledWith(mockDB.thesis)).to.equal(true);
    })
     .expect(200, mockDB.thesis, done);
   });
    it('should create correct deadline', (done) => {
      let earlierDate = new Date(mockDB.thesis.deadline);
      earlierDate.setDate(earlierDate.getDate() - 10);
      earlierDate = earlierDate.toISOString();

      let add10DaysToDl = sinon.spy(Thesis, "add10DaysToDeadline");
      

      Thesis.add10DaysToDeadline(mockDB.thesis.deadline);

      expect(add10DaysToDl.calledWith(mockDB.thesis.deadline)).to.equal(true);
      expect(add10DaysToDl.returned(earlierDate)).to.equal(true);
      done();
    });
    it('should add graders', (done) => {

     request(app)
     .post("/thesis")
     .send(mockDB.thesis)
     .set("Accept", "application/json")
     .expect("Content-Type", /json/)
     .expect(res => {
      
      /* First value in first call of findOrCreate() */ 
      expect(findOrCreateGrader.args[0][0])
      .to.deep.equal(mockDB.thesis.graders[0]);

      /* First value in second call of findOrCreate() */ 
      expect(findOrCreateGrader.args[1][0])
      .to.deep.equal(mockDB.thesis.graders[1]);
    })
     .expect(200, mockDB.thesis, done);
   });

    it('should send reminder to student with correct token', (done) => {
      const token = tokenGen.generateEthesisToken(mockDB.thesis.author, mockDB.thesis.id);

      request(app)
      .post("/thesis")
      .send(mockDB.thesis)
      .set("Accept", "application/json")
      .expect(res => {
        EmailReminder.sendStudentReminder.restore();
      })
      .expect("Content-Type", /json/)
      .expect(res => {
        expect(sendStudentReminder.calledWith(mockDB.thesis.email, token)).to.equal(true);
      })
      .expect(200, mockDB.thesis, done);
    });

    it('should test everything', (done) => {

     request(app)
     .post("/thesis")
     .send(mockDB.thesis)
     .set("Accept", "application/json")
     .expect("Content-Type", /json/)
     .expect(res => {
      expect(true).to.equal(true);
    })
     .expect(200, mockDB.thesis, done);
   });
  })
})
