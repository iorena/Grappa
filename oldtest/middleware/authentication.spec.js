"use strict";

const request = require("supertest");
const expect = require("chai").expect;
const sinon = require("sinon");
const mockDB = require("../mockdata/database");

const app = require("../testhelper").app;
const authorizedAdmin = require("../mockdata/token").admin;

const auth = require("../../middleware/authentication");
const ThesisController = require("../../controllers/thesis");
const User = require("../../models/user");
const TokenGenerator = require("../../services/TokenGenerator");

describe("Authentication", () => {
  // before(() => {
  //   sinon.stub(ThesisController, "findAll", (req, res, next) => {
  //     throw("asdf");
  //     res.status(500).send({e: "asdf"})
  //     // if (req.user === authorizedAdmin.decoded) {
  //     //   return Promise.resolve();
  //     // }
  //     // return Promise.reject();
  //   });
  // });
  // after(() => {
  //   ThesisController.findAll.restore();
  // });
  describe("authenticate()", () => {
    it("should accept request with valid token and userId as headers", (done) => {
      request(app)
      .get("/auth")
      .set("Accept", "application/json")
      .set("X-Access-Token", authorizedAdmin.token)
      .set("X-Key", authorizedAdmin.id)
      .expect("Content-Type", /json/)
      .expect(200, done);
    });
    xit("should add the decoded user to the request (req.user = decodedUser)", (done) => {
      const stubi = sinon.stub(ThesisController, "findAll", (req, res, next) => {
        if (req.user === authorizedAdmin.decoded) {
          res.status(304).send();
        } else {
          res.status(500).send();
        }
      });
      request(app)
      .get("/thesis")
      .set("Accept", "application/json")
      .set("X-Access-Token", authorizedAdmin.token)
      .set("X-Key", authorizedAdmin.id)
      .expect("Content-Type", /json/)
      // .expect(res => {
      //   expect(stubi.calledWith("adf")).to.equal(true);
      // })
      .expect(304, done);
    });
    it("should decline with 401 when there's no valid headers in request", (done) => {
      request(app)
      .get("/auth")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(401, done);
    });
    it("should decline with 401 when headers' content is invalid", (done) => {
      request(app)
      .get("/auth")
      .set("Accept", "application/json")
      .set("X-Access-Token", "invalid")
      .set("X-Key", "invalid")
      .expect("Content-Type", /json/)
      .expect(401, done);
    });
    it("should decline with 401 when token is valid but the userId doesn't match", (done) => {
      request(app)
      .get("/auth")
      .set("Accept", "application/json")
      .set("X-Access-Token", authorizedAdmin.token)
      .set("X-Key", "0")
      .expect("Content-Type", /json/)
      .expect(401, done);
    });
    xit("should decline with 401 when token has expired", (done) => {
      request(app)
      .get("/auth")
      .set("Accept", "application/json")
      .set("X-Access-Token", authorizedAdmin.expiredToken)
      .set("X-Key", authorizedAdmin.id)
      .expect("Content-Type", /json/)
      .expect(401, done);
    });
  });
});
