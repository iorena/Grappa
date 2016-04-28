"use strict";
const expect = require("chai").expect;
const scheduler = require("../../services/scheduler");
const sinon = require("sinon");

describe("scheduler", () => {
  it("should combine two objects into one", () => {
    const thesis = {
      id: 1,
      author: "meitsi",
    };
    const thesisProgress = {
      gradersStatus: false,
    };
    const newObj = scheduler.combineProps(thesis, thesisProgress);
    expect(newObj).to.deep.equal({
      id: 1,
      author: "meitsi",
      gradersStatus: false,
    });
  });
});
