"use strict";

const expect = require("chai").expect;
const sinon = require("sinon");

const Thesis = require("../../models/thesis");
const tables = require("../../models/tables");

const ThesisProgress = require("../../models/thesisprogress");

const mockDB = require("../mockdata/database");

describe("ThesisModel", () => {

  before(() => {
  /* 
   * Replace sequelize's db calls with a simple filter of mock database,
   * which is just an array
   */
    sinon.stub(Thesis, "findAll", (params) => {
      if (!params) return Promise.resolve(mockDB.theses);
      const theses = mockDB.theses.filter((item) => {
        if (item[Object.keys(params)[0]] !== params[Object.keys(params)[0]]) return false;
        return true;
      });
      return Promise.resolve(theses);
    });
    sinon.stub(Thesis, "findOne", (params) => {
      const thesis = (mockDB.theses.filter((item) => {
        for (const attr in params) {
          if (item.attr !== params.attr) return false;
        }
        return true;
      }));
      return Promise.resolve(thesis[0]);
    });
  });
  after(() => {
    Thesis.findAll.restore();
    Thesis.findOne.restore();
  });
  describe("findAll()", () => {
    it("should do stuff..", () => {
    })
  })
  describe("saveOne(thesis)", () => {
    it("should save correctly validated thesis", () => {
    });
    it("should throw an error when validation fails", () => {
    });
  })
  describe("findAllByRole", () => {
    it("should find all theses when searching as print person", () => {
      Thesis.findAllByUserRole({ role: "print-person" })
      .then((theses) => {
        expect(theses.length).to.equal(mockDB.theses.length);
        done();
      });
    });
    it("should find all theses when searching as admin", (done) => {
      Thesis.findAllByUserRole({ role: "admin" })
      .then((theses) => {
        expect(theses.length).to.equal(mockDB.theses.length);
        done();
      });
    });
    it("should find only theses belonging to a professor's study field", (done) => {
      Thesis.findAllByUserRole({ role: "professor", StudyFieldId: 1 })
      .then((theses) => {
        expect(theses.length).to.equal(1);
        done();
      });
    });
    it("should find only theses belonging to a professor's study field (2)", (done) => {
      Thesis.findAllByUserRole({ role: "professor", StudyFieldId: 4 })
      .then((theses) => {
        expect(theses.length).to.equal(0);
        done();
      });
    });
    it("should find an instructor's own thesis", (done) => {
      Thesis.findAllByUserRole({ role: "instructor", id: 4 })
      .then((theses) => {
        expect(theses.grade).to.equal("Laudatur");
        done();
      });
    });

  });
});
