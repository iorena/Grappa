"use strict";

const request = require("supertest");
const expect = require("chai").expect;
const sinon = require("sinon");

const app = require("../testhelper").app;

const CMController = require("../../controllers/councilmeeting");
const CouncilMeeting = require("../../models/councilmeeting");

const mockDB = require("../mockdata/database");

describe("CouncilMeetingController", () => {
  describe("GET /councilmeeting (findAll)", () => {
    sinon.stub(CouncilMeeting, "findAll", () => {
      return Promise.resolve(mockDB.councilmeetings);
    });
    it("should call CouncilMeeting-model correctly and return councilmeetings", (done) => {
      request(app)
      .get("/councilmeeting")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200, mockDB.councilmeetings, done);
    })
    CouncilMeeting.findAll.restore();

  })
  describe("POST /councilmeeting (saveOne)", () => {
    sinon.stub(CouncilMeeting, "saveOne", (reqbody) => {
      return Promise.resolve(mockDB.councilmeeting);
    });
    it("should save cmeeting and return it", (done) => {
      request(app)
      .post("/councilmeeting")
      .send({ name: "councilmeeting to be saved"})
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200, mockDB.councilmeeting, done);
    });
    CouncilMeeting.saveOne.restore();

  })
})
