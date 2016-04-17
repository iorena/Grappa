"use strict";

const request = require("supertest");
const expect = require("chai").expect;
const sinon = require("sinon");

const app = require("../testhelper").app;

const ThesisController = require("../../controllers/thesis");

const Thesis = require("../../models/thesis");
const ThesisProgress = require("../../models/thesisprogress");

const mockDB = require("../mockdata/database");

describe("ThesisController", () => {
  describe("GET /thesis (findAll)", () => {
    it("should call Thesis-model correctly and return theses", (done) => {
      sinon.stub(Thesis, "findAll", () => {
        return Promise.resolve(mockDB.theses);
      });
      request(app)
      .get("/thesis")
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, mockDB.theses, done);
    })
  })
  describe("POST /thesis (saveOne)", () => {
    it("should save thesis and call different models correctly and return thesis", (done) => {
      done();
    });
  })
})
