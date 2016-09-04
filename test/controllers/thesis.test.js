"use strict";

const request = require("supertest");

const expect = require("chai").expect;
const sinon = require("sinon");

const app = require("../testhelper").app;
const generateDB = require("../testhelper").generateTestDB;

const authorizedAdmin = require("../mockdata/token").admin;

const ThesisController = require("../../controllers/thesis");

const Thesis = require("../../models/thesis");

const mockDB = require("../mockdata/database");
const mockResponses = require("../mockdata/responses");

describe("ThesisController", () => {
  describe("findAllByUserRole, GET /thesis", () => {
    it("should return Theses with correct permissions", (done) => {
      request(app)
      .get("/thesis")
      .set("Accept", "application/json")
      .set("X-Access-Token", authorizedAdmin.token)
      .expect("Content-Type", /json/)
      .expect(mockResponses.expectResponse("thesis", "get"))
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
});
