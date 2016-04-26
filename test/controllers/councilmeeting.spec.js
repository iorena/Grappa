"use strict";

const request = require("supertest");
const expect = require("chai").expect;
const sinon = require("sinon");

const app = require("../testhelper").app;

const CMController = require("../../controllers/councilmeeting");
const CouncilMeeting = require("../../models/councilmeeting");

const mockDB = require("../mockdata/database");

describe("CouncilMeetingController", () => {
  before(() => {
    sinon.stub(CouncilMeeting, "findAll", () => {
      return Promise.resolve(mockDB.councilmeetings);
    });

    sinon.stub(CouncilMeeting, "saveOne", (reqbody) => {
      return Promise.resolve(mockDB.councilmeeting);
    });
  })

  after(() => {
    CouncilMeeting.findAll.restore();
    CouncilMeeting.saveOne.restore();
  })

  describe("GET /councilmeeting (findAll)", () => {
    it("should call CouncilMeeting-model correctly and return councilmeetings", (done) => {
      request(app)
      .get("/councilmeeting")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200, mockDB.councilmeetings, done);
    })
    it("should fail with 500 if findAll throws error", (done) => {
      CouncilMeeting.findAll.restore();
      sinon.stub(CouncilMeeting, "findAll", () => {
        return Promise.reject();
      });
      request(app)
      .get("/councilmeeting")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(500, {message: "CouncilMeeting findAll produced an error"}, done);
    })
  })
  describe("POST /councilmeeting (saveOne)", () => {
    it("should save cmeeting and return it", (done) => {
      request(app)
      .post("/councilmeeting")
      .send({ name: "councilmeeting to be saved"})
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200, mockDB.councilmeeting, done);
    });
    it("should fail with 500 if saveOne throws error", (done) => {
      CouncilMeeting.saveOne.restore();
      sinon.stub(CouncilMeeting, "saveOne", () => {
        return Promise.reject();
      });
      request(app)
      .post("/councilmeeting")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(500, {message: "CouncilMeeting saveOne produced an error"}, done);
    })
  })
})
