"use strict";

const request = require("supertest");
const expect = require("chai").expect;
const sinon = require("sinon");
const mockDB = require("../mockdata/database");

const app = require("../testhelper").app;

const StudyField = require("../../models/studyfield");

describe("StudyFieldController", () => {
  before(() => {
    sinon.stub(StudyField, "findAll", () => {
      return Promise.resolve(mockDB.studyfields);
    });
  });

  after(() => {
    StudyField.findAll.restore();
  });

  describe("GET /studyfield (findAll)", () => {
    it("should call StudyField-model correctly and return studyfields", (done) => {
      request(app)
      .get("/studyfield")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200, mockDB.studyfields, done);
    });
    it("should fail with 500 if findAll throws error", (done) => {
      StudyField.findAll.restore();
      sinon.stub(StudyField, "findAll", () => {
        return Promise.reject();
      });
      request(app)
      .get("/studyfield")
      .set("Accept", "application/json")
      .expect(500, { message: "StudyField findAll produced an error" }, done);
    });
  });
});
