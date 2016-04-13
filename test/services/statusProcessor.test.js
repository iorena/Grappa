const expect = require("chai").expect;
const fs = require("fs");
const nock = require("nock");
const statusProcessor = require("../../services/statusProcessor");

mockHTML = (url) => {
  return new Promise((resolve, reject) => {
    fs.readFile("./test/services/ethesisPage.mock.html", "utf-8", (err, data) => {
      if (err) {
        reject(err);

      }
      nock(url)
      .get("")
      .reply(200, data);
      resolve();
    });
  });
}

describe("abstract fetcher", () => {
  it("should successfully fetch abstract", (done) => {
    const url = "https://helda.helsinki.fi/handle/10138/161191";
    const expectedAbstractBlurb = "Tutkimuksessa käsitellään laittomasti hankittujen todisteiden hyödyntämiskieltoa";
    mockHTML(url)
    .then(() => {
      return statusProcessor.fetchAbstract(url);
    })
    .then((fetchedAbstract) => {
      expect(fetchedAbstract.substring(0, expectedAbstractBlurb.length)).to.equal(expectedAbstractBlurb);
      done();
    });
  });
});
