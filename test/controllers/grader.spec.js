"use strict";

const request = require("supertest");
const expect = require("chai").expect;
const sinon = require("sinon");
const mockDB = require("../mockdata/database");

const app = require("../testhelper").app;

const Grader = require("../../models/grader");


describe("GraderController", () => {
  before(() => {
    sinon.stub(Grader, "findAll", () => {
      return Promise.resolve(mockDB.competentGraders);
    });
    sinon.stub(Grader, "saveOne", (reqbody) => {
      return Promise.resolve(mockDB.competentGraders[0]);
    });
  });

  after(() => {
    Grader.findAll.restore();
    Grader.saveOne.restore();
  });

  describe("GET /grader (findAll)", () => {
    it("should call Grader-model correctly and return graders", (done) => {
      request(app)
      .get("/grader")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200, mockDB.competentGraders, done);
    });
    it("should fail with 500 if findAll throws error", (done) => {
      Grader.findAll.restore();
      sinon.stub(Grader, "findAll", () => {
        return Promise.reject();
      });
      request(app)
      .get("/grader")
      .set("Accept", "application/json")
      .expect(500, { message: "Grader findAll produced an error" }, done);
    });
  });
  describe("POST /grader (saveOne)", () => {
    it("should save grader and return it", (done) => {
      request(app)
      .post("/grader")
      .send({ name: "grader to be saved" })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200, mockDB.competentGraders[0], done);
    });
    it("should fail with 500 if saveone throws error", (done) => {
      Grader.saveOne.restore();
      sinon.stub(Grader, "saveOne", () => {
        return Promise.reject();
      });
      request(app)
      .post("/grader")
      .set("Accept", "application/json")
      .expect(500, { message: "Grader saveOne produced an error" }, done);
    });
  });
});
