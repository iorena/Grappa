 "use strict";

 const request = require("supertest");
 const expect = require("chai").expect;
 const sinon = require("sinon");
 const mockDB = require("../mockdata/database");

 const app = require("../testhelper").app;

 const User = require("../../models/user");
 const TokenGenerator = require("../../services/TokenGenerator");


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
    sinon.stub(User, "update", () => {
      return Promise.resolve([1]);
    })
  })

  after(() => {
    User.findAll.restore();
    User.saveOne.restore();
    User.findOne.restore();
    User.update.restore();
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

  describe("PUT /user/:id", () => {
    it("should call User-model and update one User correctly", (done) => {
      request(app)
      .put("/user/1")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200, done);
    });
    it("should fail miserably with 500 if update throws error", (done) => {
      User.update.restore();
      sinon.stub(User, "update", () => {
        return Promise.reject();
      })

      request(app)
      .put("/user/1")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(500, done);
    });
  });

  describe("POST /login", () => {
    it("should find correct user and create a token", (done) =>  {
      User.findOne.restore();
      sinon.stub(User, "findOne", () => {
        return Promise.resolve(mockDB.users[0]);
      });
      var generateTokenSpy = sinon.spy(TokenGenerator, "generateToken");

      request(app)
      .post("/login")
      .send({ name: "user to be login"})
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(res => {
        expect(generateTokenSpy.calledWith(mockDB.users[0])).to.equal(true);
      })
      .expect(200, done);
    });
    it("should fail with 401 if user is not found", (done) => {
      User.findOne.restore();
      sinon.stub(User, "findOne", () => {
        return Promise.resolve(null);
      });
      request(app)  
      .post("/login")
      .set("Accept", "application/json")
      .expect(401, {message: "Logging in failed authentication", error: "Dawg"}, done);
    });
    it("should fail with 500 if findOne throws error", (done) => {
      User.findOne.restore();
      sinon.stub(User, "findOne", () => {
        return Promise.reject();
      })

      request(app)  
      .post("/login")
      .set("Accept", "application/json")
      .expect(500, {message: "User loginUser produced an error"}, done);
    });
  })

})




