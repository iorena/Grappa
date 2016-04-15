"use strict";
const request = require("request");
const expect = require("chai").expect;
const Thesis = require("../../models/thesis");
const Sender = require("../../services/EmailSender");
const Reminder = require("../../services/EmailReminder");
const Sinon = require("sinon");
const User = require("../../models/user");
const EmailStatus = require("../../models/email_status");

const thesis = {
  id: 999999,
  author: "EKA GRADU",
  email: "spamdoesnotexistasdfasdf@gmail.com",
  title: "ihminen",
  ethesis: "https://ethesis.com/teemu",
  abstract: "Hauki on kala",
  grade: "Approbatur",
  deadline: Date.now(),
};

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


describe("When call sendStudentReminder", () => {
  it("should call sendEmail with correct values", (done) => {
  	Reminder.sendStudentReminder(thesis)
  	.then(status => {
  		expect(calledParams.to).to.equal(thesis.email);
  		expect(calledParams.subject).to.equal("REMINDER: Submit your thesis to eThesis");
  		done();
  	})
  });
});

describe("When call sendPrinterReminder", () => {
	it("should call sendEmail with correct values", (done) => {
		Sinon.stub(User, "findOne", (params) => {
			if (typeof params.title !== "undefined" && params.title === "print-person") {
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
		})

  		Reminder.sendPrinterReminder(thesis)
  		.then(status => {
	  		expect(calledParams.to).to.equal("printperson@gmail.com");
	  		expect(calledParams.subject).to.equal("NOTE: Upcoming councilmeeting");
	  		done();
  		})
	});
});


describe("When call sendProfessorReminder", () => {
	it("should call sendEmail with correct values", (done) => {
  		Reminder.sendProfessorReminder(thesis)
  		.then(status => {
	  		expect(calledParams.to).to.equal("ohtugrappa@gmail.com");
	  		expect(calledParams.subject).to.equal("REMINDER: Submit your evaluation");
	  		done();
  		})
	});
});

