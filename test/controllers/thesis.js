"use strict";

const request = require('dupertest');
// const request = require("request");
const expect = require("chai").expect;

const ThesisController = require("../../controllers/thesis");

const Thesis = require("../../models/thesis");
const ThesisProgress = require("../../models/thesisprogress");

const mockData = require("../mockdata");

describe("ThesisController", () => {
  it("should call different models with correct params", (done) => {
    request(ThesisController.saveOne)
    .body(mockData.thesis)
    .end((res) => {
      console.log(res)
      expect(res).toEqual(mockData.thesis);
      done();
    });
  });
});
