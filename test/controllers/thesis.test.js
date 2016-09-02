"use strict";

const request = require("supertest");
const expect = require("chai").expect;
const sinon = require("sinon");

const app = require("../testhelper").app;

const authorizedAdmin = require("../mockdata/token").admin;

const ThesisController = require("../../controllers/thesis");

const Thesis = require("../../models/thesis");

const mockDB = require("../mockdata/database");
// const stubs = require("../mockdata/stubs");

const stubber = require("../mockdata/stubber");

let sandbox;
let Stubs = {};
let StubThesis;

describe("ThesisController", () => {

  before(() => {
    sandbox = sinon.sandbox.create();

    Stubs.Thesis = stubber.Thesis(sandbox);

    sandbox.stub(Thesis, "findAllByUserRole", () => {
      return Promise.resolve(mockDB.theses);
    });
    // findOrCreateGrader = sandbox.stub(Grader, "findOrCreate", () => {
    //   return Promise.resolve();
    // });
  });

  after(() => {
    sandbox.restore();
  });

  describe("findAllByUserRole, GET /thesis", () => {
    it("should return Theses with correct permissions", (done) => {
      request(app)
      .get("/thesis")
      .set("Accept", "application/json")
      .set("X-Access-Token", authorizedAdmin.token)
      .expect("Content-Type", /json/)
      .expect(200, mockDB.theses, done);
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
