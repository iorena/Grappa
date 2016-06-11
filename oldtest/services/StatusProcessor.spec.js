const expect = require("chai").expect;
const fs = require("fs");
const nock = require("nock");
const Processor = require("../../services/StatusProcessor");
const sinon = require("sinon");
const EmailReminder = require("../../services/EmailReminder");

const mockHTML = (url) => {
  return new Promise((resolve, reject) => {
    fs.readFile("./test/mockdata/ethesisPage.html", "utf-8", (err, data) => {
      if (err) {
        reject(err);
      }
      nock(url)
      .get("")
      .reply(200, data);
      resolve();
    });
  });
};

describe("StatusProcessor", () => {
  const mockThesis1 = {
    gradersStatus: false,
    ethesis: null,
    abstract: null,
  };
  const mockThesis2 = {
    gradersStatus: false,
    ethesis: "http://google.com",
    abstract: null,
  };
  const mockThesis3 = {
    gradersStatus: false,
    ethesis: "http://google.com",
    abstract: "Google is a search engine",
  };
  const mockThesis4 = {
    gradersStatus: true,
    ethesis: "http://google.com",
    abstract: "Google is a search engine",
  };
  describe("fetchAbstract(ethesisUrl)", () => {
    it("should successfully fetch abstract", (done) => {
      const url = "https://helda.helsinki.fi/handle/10138/161191";
      const expectedAbstractBlurb = "Tutkimuksessa käsitellään laittomasti hankittujen todisteiden hyödyntämiskieltoa";
      mockHTML(url).then(() => {
        return Processor.fetchAbstract(url);
      })
      .then((fetchedAbstract) => {
        expect(fetchedAbstract.substring(0, expectedAbstractBlurb.length)).to.equal(expectedAbstractBlurb);
        done();
      });
    });
    it("should fetch abstract when an ethesis link is entered", (done) => {
      const spy = sinon.spy(Processor, "fetchAbstract");
      Processor.processThesisStatus(mockThesis2);
      expect(spy.calledOnce).to.equal(true);
      spy.restore();
      done();
    });
    it("should not try to fetch abstract if it has already been fetched", (done) => {
      const spy = sinon.spy(Processor, "fetchAbstract");
      Processor.processThesisStatus(mockThesis3);
      expect(spy.callCount).to.equal(0);
      spy.restore();
      done();
    });
    it("should not try to fetch abstract if no link has been added", (done) => {
      const spy = sinon.spy(Processor, "fetchAbstract");
      Processor.processThesisStatus(mockThesis1);
      expect(spy.callCount).to.equal(0);
      spy.restore();
      done();
    });
  });
  xdescribe("processThesisStatus(thesis)", () => {
    it("should send reminder to the print-person if thesis is ready to printed for the meeting", (done) => {
      const spy = sinon.spy(Processor, "sendToPrintPerson");
      Processor.processThesisStatus(mockThesis4);
      expect(spy.callCount).to.equal(1);
      spy.restore();
      done();
    });
    it("should not send print person anything prematurely", (done) => {
      const spy = sinon.spy(EmailReminder, "sendPrintPersonReminder");
      Processor.processThesisStatus(mockThesis1);
      expect(spy.callCount).to.equal(0);
      spy.restore();
      done();
    });
  });
});
