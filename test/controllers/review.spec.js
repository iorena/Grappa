
"use strict";

const request = require("supertest");
const expect = require("chai").expect;
const sinon = require("sinon");
const mockDB = require("../mockdata/database");

const app = require("../testhelper").app;

const authorizedAdmin = require("../mockdata/token").admin;

const Review = require("../../models/review");


describe("ReviewController", () => {
  before(() => {
    sinon.stub(Review, "findAllByRole", () => {
      return Promise.resolve(mockDB.reviews);
    });
    sinon.stub(Review, "saveOne", (reqbody) => {
      return Promise.resolve(mockDB.reviews[0]);
    });
  });

  after(() => {
    Review.findAllByRole.restore();
    Review.saveOne.restore();
  });

  it("GET /review (findAllByRole)", () => {
    it("should call Review-model correctly and return reviews", (done) => {
      request(app)
      .get("/review")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200, mockDB.reviews, done);
    });
    it("should fail with 500 if findAll throws error", (done) => {
      Review.findAllByRole.restore();
      sinon.stub(Review, "findAllByRole", () => {
        return Promise.reject();
      });
      request(app)
      .get("/review")
      .set("Accept", "application/json")
      .expect(500, { message: "Review findAllByRole produced an error" }, done);
    });
  });
  describe("POST /review (saveOne)", () => {
    it("should save review and return it", (done) => {
      request(app)
      .post("/review")
      .send({ name: "review to be saved" })
      .set("Accept", "application/json")
      .set("X-Access-Token", authorizedAdmin.token)
      .set("X-Key", authorizedAdmin.id)
      .expect("Content-Type", /json/)
      .expect(200, mockDB.reviews[0], done);
    });
    it("should fail with 500 if saveone throws error", (done) => {
      Review.saveOne.restore();
      sinon.stub(Review, "saveOne", () => {
        return Promise.reject();
      });
      request(app)
      .post("/review")
      .set("Accept", "application/json")
      .set("X-Access-Token", authorizedAdmin.token)
      .set("X-Key", authorizedAdmin.id)
      .expect(500, { message: "Review saveOne produced an error" }, done);
    });
  });
});
