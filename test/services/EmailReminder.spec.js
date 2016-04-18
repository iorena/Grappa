"use strict";

const request = require("request");
const expect = require("chai").expect;
const Thesis = require("../../models/thesis");
const Sender = require("../../services/EmailSender");
const Reminder = require("../../services/EmailReminder");
const Sinon = require("sinon");
const User = require("../../models/user");
const EmailStatus = require("../../models/email_status");

const thesis = require("../mockdata/database").thesis;

let calledParams = {};
Sinon.stub(Sender, "sendEmail", (to, subject, body) => {
	calledParams = {
		to,
		subject,
		body,
	};
	return Promise.resolve(calledParams);
})
Sinon.stub(EmailStatus, "saveOne", function(params) {
	return Promise.resolve(params);
})

describe("EmailReminder", () => {
  describe("sendStudentReminder(thesis)", () => {
    it("should call sendEmail with correct values", (done) => {
        const email = "pertti@perttinen.fi";
    	Reminder.sendStudentReminder(email, "ASDF123")
    	.then(status => {
    		expect(calledParams.to).to.equal(email);
    		expect(calledParams.subject).to.equal("REMINDER: Submit your thesis to eThesis");
    		done();
    	})
    });
  });
  describe("sendPrintPersonReminder(thesis)", () => {
  	it("should call sendEmail with correct values", (done) => {
  		Sinon.stub(User, "findOne", (params) => {
  			if (typeof params.role !== "undefined" && params.role === "print-person") {
  				return Promise.resolve({
  					id: 2,
				    name: "B Virtanen",
				    title: "print-person",
				    email: "printperson@gmail.com",
				    admin: true,
  				})
  			} else {
  				return Promise.resolve(null);
  			}
  		});
  		Reminder.sendPrintPersonReminder(thesis)
  		.then(status => {
	  		expect(calledParams.to).to.equal("printperson@gmail.com");
	  		expect(calledParams.subject).to.equal("NOTE: Upcoming councilmeeting");
	  		done();
  		})
  	});
  });
  describe("sendProfessorReminder(thesis)", () => {
  	it("should call sendEmail with correct values", (done) => {
  		Reminder.sendProfessorReminder(thesis)
  		.then(status => {
	  		expect(calledParams.to).to.equal("ohtugrappa@gmail.com");
	  		expect(calledParams.subject).to.equal("REMINDER: Submit your evaluation");
	  		done();
  		})
  	});
  });
});
