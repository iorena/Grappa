"use strict";

const request = require("request");
const expect = require("chai").expect;

describe("app", () => {
  let url = "http://localhost:9876";
  it("should load", () => {
    request(url, (error, response) => {
      expect(response.statusCode).to.equal(200);
    });
  });
});
