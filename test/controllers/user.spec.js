 "use strict";

 const request = require("supertest");
 const expect = require("chai").expect;
 const sinon = require("sinon");
 const mockDB = require("../mockdata/database");

 const app = require("../testhelper").app;

 const User = require("../../models/user");


 describe("UserController", () => {
  before(() => {
    sinon.stub(User, "findAll", () => {
      return Promise.resolve(mockDB.users);
    });
    sinon.stub(User, "saveOne", (reqbody) => {
      return Promise.resolve(mockDB.users[0]);
    });
    sinon.stub(User, "findOne", () => {
      return Promise.resolve(mockDB.users[0]);
    });
  })

  after(() => {
    User.findAll.restore();
    User.saveOne.restore();
    User.findOne.restore();
  })

  describe("POST /user (saveOne)", () => {
    it("should save user and return it", (done) => {
      request(app)
      .post("/user")
      .send({ name: "user to be saved"})
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200, mockDB.users[0], done);
    });
    it("should fail with 500 if saveone throws error", (done) => {
      User.saveOne.restore();
      sinon.stub(User, "saveOne", () => {
        return Promise.reject();
      });
      request(app)  
      .post("/user")
      .set("Accept", "application/json")
      .expect(500, {message: "User saveOne produced an error"}, done);
    })
  })

  describe("GET /user", () => {
    it("findOne should call User-model correctly and return correct user", (done) => {
      request(app)
      .get("/user/1")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200, mockDB.users[0], done);
    });

    it("should fail with 500 if findAll throws error", (done) => {
      User.findOne.restore();
      sinon.stub(User, "findOne", () => {
        return Promise.reject();
      });
      request(app)  
      .get("/user/1")
      .set("Accept", "application/json")
      .expect(500, {message: "User findOne produced an error"}, done);
    })
    it("findAll should call User-model correctly and return all users", (done) => {
      request(app)
      .get("/user")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200, mockDB.users, done);
    });

    it("should fail with 500 if findAll throws error", (done) => {
      User.findAll.restore();
      sinon.stub(User, "findAll", () => {
        return Promise.reject();
      });
      request(app)  
      .get("/user")
      .set("Accept", "application/json")
      .expect(500, {message: "User findAll produced an error"}, done);
    })


  })
})




