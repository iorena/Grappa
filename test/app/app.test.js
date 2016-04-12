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

  describe("thesis route", () => {
    url += "/theses";
    it("accepts request parameters", () => {
      request(url + "?testparam=666", (error, response) => {
        expect(response.body.result.testparam).to.equal(666);
      });
    });
  });

  describe("councilmeeting route", () => {
    url += "/councilmeetings";
    it("accepts request parameters", () => {
      request(url + "?testparam=666", (error, response) => {
        expect(response.body.result.testparam).to.equal(666);
      });
    });
  });
});
