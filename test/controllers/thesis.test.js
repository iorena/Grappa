"use strict";

const request = require("supertest");

const expect = require("chai").expect;
const sinon = require("sinon");

const app = require("../testhelper").app;
const generateDB = require("../testhelper").generateTestDB;

const auth = require("../mock/authentication");

const expectResponseToEqual = require("../mock/responses");

describe("ThesisController", () => {
  describe("findAllByUserRole, GET /thesis", () => {
    it("should return all three Theses with admin permissions", (done) => {
      request(app)
      .get("/thesis")
      .set("Accept", "application/json")
      .set("X-Access-Token", auth.createToken("admin"))
      .expect("Content-Type", /json/)
      .expect(expectResponseToEqual("thesis", "get", "admin"))
      .expect(200, done);
    });

    it("should return only two Theses with professor permissions", (done) => {
      request(app)
      .get("/thesis")
      .set("Accept", "application/json")
      .set("X-Access-Token", auth.createToken("professor"))
      .expect("Content-Type", /json/)
      .expect(expectResponseToEqual("thesis", "get", "professor"))
      .expect(200, done);
    });

    it("should return only one Thesis with instructor permissions", (done) => {
      request(app)
      .get("/thesis")
      .set("Content-Type", "application/json")
      .set("X-Access-Token", auth.createToken("instructor"))
      .expect("Content-Type", /json/)
      .expect(expectResponseToEqual("thesis", "get", "instructor"))
      .expect(200, done);
    });

    it("shouldn't return Theses without correct permissions", (done) => {
      request(app)
      .get("/thesis")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(401, done);
    });
  });

  describe("saveOne, POST /thesis", () => {
    it("should return all three Theses with admin permissions", (done) => {
      request(app)
      .post("/thesis")
      .field("json", "some json")
      .attach("file", "./test/mock/grappa-review1.pdf")
      .set("Accept", "multipart/form-data")
      .set("X-Access-Token", auth.createToken("admin"))
      .expect("Content-Type", /json/)
      .expect(200, done);
    });

    xit("shouldn't save Thesis without correct permissions", (done) => {
      request(app)
      .post("/thesis")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(401, done);
    });
  });
});
