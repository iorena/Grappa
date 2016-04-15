"use strict";

const request = require("supertest");
const expect = require("chai").expect;
const sinon = require("sinon");

const app = require("../testhelper").app;

const CMController = require("../../controllers/councilmeeting");
const CouncilMeeting = require("../../models/councilmeeting");

const mockData = require("../mockdata");

describe("CouncilMeetingController", () => {
  describe("GET /councilmeeting (findAll)", () => {
    it("should call CouncilMeeting-model correctly and return councilmeetings", (done) => {
      sinon.stub(CouncilMeeting, "findAll", () => {
        return Promise.resolve(mockData.councilmeetings);
      });
      request(app)
      .get("/councilmeeting")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200, mockData.councilmeetings, done);
    })
  })
  describe("POST /councilmeeting (saveOne)", () => {
    it("should save cmeeting and return it", (done) => {
      sinon.stub(CouncilMeeting, "saveOne", (reqbody) => {
        // console.log("yo body on " + JSON.stringify(reqbody));
        return Promise.resolve(mockData.councilmeeting);
      });
      request(app)
      .post("/councilmeeting")
      .send({ name: "councilmeeting to be saved"})
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200, mockData.councilmeeting, done);
    });
  })
})
