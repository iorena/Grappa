"use strict";

const request = require("supertest");

const expect = require("chai").expect;
const sinon = require("sinon");

const app = require("../testhelper").app;
const generateDB = require("../testhelper").generateTestDB;

const auth = require("../mock/authentication");

const expectResponseToEqual = require("../mock/responses");

const EmailSender = require("../../services/EmailSender");
let sandbox = sinon.sandbox.create();
sandbox.stub(EmailSender, "sendEmail", () =>
  Promise.resolve()
)

describe("ThesisController", () => {
  describe("findAllByUserRole, GET /thesis", () => {
    it("should return all four Theses with admin permissions", (done) => {
      request(app)
      .get("/thesis")
      .set("Accept", "application/json")
      .set("X-Access-Token", auth.createToken("admin"))
      .expect("Content-Type", /json/)
      // .expect(res => {
      //   console.log("response: ", res)
      // })
      .expect(expectResponseToEqual("thesis", "get", "admin"))
      .expect(200, done);
    });

    it("should return only three Theses with professor permissions", (done) => {
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
      .set("Content-Type", "application/json")
      // .expect(res => {
      //   console.log("response: ", res)
      // })
      .expect("Content-Type", /json/)
      .expect(401)
      .end(done)
    });
  });

  describe("saveOne, POST /thesis", () => {
    it("should save and return the thesis with admin permissions", function(done) {
      this.timeout(4000);
      request(app)
      .post("/thesis")
      .field("json", '{"authorLastname":"b","StudyFieldId":"1","authorFirstname":"a","authorEmail":"teemu.koivisto@helsinki.fi","CouncilMeetingId":"1","grade":"Approbatur","Graders":[{"id":1},{"id":2}],"title":"a","urkund":"https://secure.urkund.com"}')
      .attach("file", "./test/mock/grappa-review1.pdf")
      .set("Content-Type", "multipart/form-data")
      .set("X-Access-Token", auth.createToken("admin"))
      .expect("Content-Type", /json/)
      // .expect(res => {
      //   console.log("response: ", res.body)
      // })
      .expect(200, done);
    });

    it("shouldn't save Thesis without correct permissions", (done) => {
      request(app)
      .post("/thesis")
      .field("json", '{"authorLastname":"b","StudyFieldId":"1","authorFirstname":"a","authorEmail":"teemu.koivisto@helsinki.fi","CouncilMeetingId":"1","grade":"Approbatur","Graders":[{"id":1},{"id":2}],"title":"a","urkund":"https://secure.urkund.com"}')
      // What to do when test frame work fails testing? You skip those tests :DDD
      // https://github.com/visionmedia/supertest/issues/351
      // .attach("file", "./test/mock/grappa-review1.pdf")
      .set("Content-Type", "multipart/form-data")
      .expect("Content-Type", /json/)
      .expect(401, done);
    });
  });
});
