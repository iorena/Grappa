 "use strict";

 const request = require("supertest");
 const expect = require("chai").expect;
 const sinon = require("sinon");
 const mockDB = require("../mockdata/database");

 const app = require("../testhelper").app;

 const ThesisProgress = require("../../models/thesisprogress");


 describe("ThesisProgressController", () => {
  before(() => {
    sinon.stub(ThesisProgress, "findAll", () => {
      return Promise.resolve(mockDB.thesisprogresses);
    });
    sinon.stub(ThesisProgress, "saveOne", (reqbody) => {
      return Promise.resolve(mockDB.thesisprogresses[0]);
    });
    sinon.stub(ThesisProgress, "findOne", () => {
      return Promise.resolve(mockDB.thesisprogresses[0]);
    });
  })

  after(() => {
    ThesisProgress.findAll.restore();
    ThesisProgress.saveOne.restore();
    ThesisProgress.findOne.restore();
  })

  describe("POST /thesisprogress (saveOne)", () => {
    it("should save thesisprogress and return it", (done) => {
      request(app)
      .post("/thesisprogress")
      .send({ name: "thesisprogress to be saved"})
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200, mockDB.thesisprogresses[0], done);
    });
    it("should fail with 500 if saveone throws error", (done) => {
      ThesisProgress.saveOne.restore();
      sinon.stub(ThesisProgress, "saveOne", () => {
        return Promise.reject();
      });
      request(app)  
      .post("/thesisprogress")
      .set("Accept", "application/json")
      .expect(500, {message: "ThesisProgress saveOne produced an error"}, done);
    })
  })

  describe("GET /thesisprogress", () => {
    it("findOne should call ThesisProgress-model correctly and return correct TP", (done) => {
      request(app)
      .get("/thesisprogress/30")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200, mockDB.thesisprogresses[0], done);
    });

    it("should fail with 500 if findAll throws error", (done) => {
      ThesisProgress.findOne.restore();
      sinon.stub(ThesisProgress, "findOne", () => {
        return Promise.reject();
      });
      request(app)  
      .get("/thesisprogress/30")
      .set("Accept", "application/json")
      .expect(500, {message: "ThesisProgress findOne produced an error"}, done);
    })
    it("findAll should call ThesisProgress-model correctly and return all TP", (done) => {
      request(app)
      .get("/thesisprogress")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200, mockDB.thesisprogresses, done);
    });

    it("should fail with 500 if findAll throws error", (done) => {
      ThesisProgress.findAll.restore();
      sinon.stub(ThesisProgress, "findAll", () => {
        return Promise.reject();
      });
      request(app)  
      .get("/thesisprogress")
      .set("Accept", "application/json")
      .expect(500, {message: "ThesisProgress findAll produced an error"}, done);
    })


  })
})




