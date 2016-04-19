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
    it("should call CouncilMeeting-model correctly and return councilmeetings", (done) => {
      sinon.stub(CouncilMeeting, "findAll", () => {
        return Promise.resolve(mockDB.councilmeetings);
      });
      request(app)
      .get("/councilmeeting")
      .set("Accept", "application/json")
      .expect(res => {
        CouncilMeeting.findAll.restore();
      })
      .expect("Content-Type", /json/)
      .expect(200, mockDB.councilmeetings, done);


    })
  })
  describe("POST /councilmeeting (saveOne)", () => {
    sinon.stub(CouncilMeeting, "saveOne", (reqbody) => {
        // console.log("yo body on " + JSON.stringify(reqbody));
        return Promise.resolve(mockDB.councilmeeting);
      });
    it("should save cmeeting and return it", (done) => {

      request(app)
      .post("/councilmeeting")
      .send({ name: "councilmeeting to be saved"})
      .set("Accept", "application/json")
      .expect(res => {
        CouncilMeeting.saveOne.restore();

      })
      .expect("Content-Type", /json/)
      .expect(200, mockDB.councilmeeting, done);



    });

  })
})
