"use strict";

const request = require("supertest");
const expect = require("chai").expect;
const sinon = require("sinon");
const mockDB = require("../mockdata/database");
const stubber = require("../mockdata/stubber");

const app = require("../testhelper").app;

const ThesisProgress = require("../../models/thesisprogress");

const Stubs = {};
let sandbox;

describe("ThesisProgressController", () => {
  before(() => {
    sandbox = sinon.sandbox.create();

    Stubs.ThesisProgress = stubber.ThesisProgress(sandbox);

    //  sinon.stub(ThesisProgress, "findAll", () => {
    //    return Promise.resolve(mockDB.thesisProgresses);
    //  });
    //  sinon.stub(ThesisProgress, "saveOne", (reqbody) => {
    //    return Promise.resolve(mockDB.thesisProgresses[0]);
    //  });
    //  sinon.stub(ThesisProgress, "findOne", () => {
    //    return Promise.resolve(mockDB.thesisProgresses[0]);
    //  });
  });

  after(() => {
    sandbox.restore();
    //  ThesisProgress.findAll.restore();
    //  ThesisProgress.saveOne.restore();
    //  ThesisProgress.findOne.restore();
  });

  describe("saveOne (POST /thesisprogress)", () => {
    it("should save thesisprogress and send it back", (done) => {
      request(app)
      .post("/thesisprogress")
      .send({ name: "thesisprogress to be saved" })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200, mockDB.thesisProgresses[0], done);
    });
    it("should send statusCode 500 if something throws an error", (done) => {
      Stubs.ThesisProgress.saveOne.restore();
      //  Stubs.ThesisProgress.saveOne = stubber.replace("ThesisProgress", "saveOne", () => (Promise.reject), sandbox);
      sinon.stub(ThesisProgress, "saveOne", () => {
        return Promise.reject();
      });
      request(app)
      .post("/thesisprogress")
      .set("Accept", "application/json")
      .expect(500, { message: "ThesisProgress saveOne produced an error" }, done);
    });
  });

  describe("findAll (GET /thesisprogress)", () => {
    xit("findOne should call ThesisProgress-model correctly and return correct TP", (done) => {
      request(app)
      .get("/thesisprogress/30")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200, mockDB.thesisProgresses[0], done);
    });

    xit("should fail with 500 if findAll throws error", (done) => {
      ThesisProgress.findOne.restore();
      sinon.stub(ThesisProgress, "findOne", () => {
        return Promise.reject();
      });
      request(app)
      .get("/thesisprogress/30")
      .set("Accept", "application/json")
      .expect(500, { message: "ThesisProgress findOne produced an error" }, done);
    });
    it("should call ThesisProgress-model and send back found ThesisProgresses", (done) => {
      request(app)
      .get("/thesisprogress")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200, mockDB.thesisProgresses, done);
    });

    it("should fail with 500 if findAll throws error", (done) => {
      ThesisProgress.findAll.restore();
      sinon.stub(ThesisProgress, "findAll", () => {
        return Promise.reject();
      });
      request(app)
      .get("/thesisprogress")
      .set("Accept", "application/json")
      .expect(500, { message: "ThesisProgress findAll produced an error" }, done);
    });
  });
});
