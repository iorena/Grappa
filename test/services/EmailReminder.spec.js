"use strict";
const request = require("request");
const expect = require("chai").expect;
const Thesis = require("../../models/thesis");
const Sender = require("../../services/EmailSender");
const Reminder = require("../../services/EmailReminder");
const Sinon = require("sinon");
const User = require("../../models/user");


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

let spy = Sinon.spy(Sender, "sendEmail");

describe("When call sendStudentReminder", () => {
  it("should call sendEmail with correct values", () => {
  	Reminder.sendStudentReminder(thesis);

  	expect(spy.calledWith(thesis.email, "REMINDER: Submit your thesis to eThesis")).to.equal(true);
  	expect(spy.called).to.equal(true);
  });
});

describe("When call sendPrinterReminder", () => {
	it("should call sendEmail with correct values", (done) => {
		Sinon.stub(User, "findOne", (params) => {
			if (params === { title: "print-person"}) {
				return Promise.resolve({
					id: 2,
				    name: "B Virtanen",
				    title: "print-person",
				    email: "ohtugrappa@gmail.com",
				    admin: true,
				})
			} else {
				return Promise.resolve(null);
			}
		})
  		Reminder.sendPrinterReminder(thesis)
  		.then(status => {
  			expect(spy.calledWith("ohtugrappa@gmail.com")).to.equal(true);
  			done();
  		})
  		//console.log(spy.args);
  		//let printer = User.findOne({ title: "print-person" });

  		

        

	});
});

describe("When call sendProfessorReminder", () => {
	it("should call sendEmail with correct values", () => {
  		Reminder.sendProfessorReminder(thesis);
  		expect(spy.calledWith("ohtugrappa@gmail.com", "REMINDER: Submit your evaluation")).to.equal(true);
	});
});
