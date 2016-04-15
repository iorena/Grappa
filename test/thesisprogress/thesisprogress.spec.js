"use strict";

const request = require("request");
const expect = require("chai").expect;

const Thesis = require("../../models/thesis");
const ThesisProgress = require("../../models/thesisprogress");

const thesis = {
  id: 999999,
  author: "EKA GRADU",
  email: "spam@gmail.com",
  title: "ihminen",
  ethesis: "https://ethesis.com/teemu",
  abstract: "Hauki on kala",
  grade: "Approbatur",
  deadline: Date.now(),
};

describe("When adding a new thesis", () => {

  let url = "http://localhost:9876/thesis";

  it("a thesisprogress should be created with correct thesis Id", () => {
    request.post(url, {form: thesis});

    ThesisProgress
    .findAll()
    .then(thesisprogresses => {
      expect(thesisprogresses[thesisprogresses.length-1].thesisId).to.equal(thesis.id);
    });
  });
});
