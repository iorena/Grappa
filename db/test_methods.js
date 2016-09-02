"use strict";

const tables = require("./tables");
const models = tables.Models;

module.exports.addTestData = () => Promise.all([
  models.StudyField.create({
    id: 1,
    name: "Algorithmic Bioinformatics",
  }),
  models.StudyField.create({
    id: 2,
    name: "Algorithms, Data Analytics and Machine Learning",
  }),
  models.StudyField.create({
    id: 3,
    name: "Networking and Services",
  }),
  models.StudyField.create({
    id: 4,
    name: "Software Systems",
  }),
  models.User.create({
    firstname: "One",
    lastname: "Admin",
    passwordHash: "$2a$10$Fs0N7KD/xUH4NAfW2s1MoOh/yH3G7mAtGycMY5tMUvCGqiWWdaSue",
    email: "ohtugrappa@gmail.com",
    role: "admin",
    isActive: true,
    isRetired: false,
    StudyFieldId: null,
  }),
  models.User.create({
    firstname: "Two",
    lastname: "Prof",
    passwordHash: "$2a$10$Fs0N7KD/xUH4NAfW2s1MoOh/yH3G7mAtGycMY5tMUvCGqiWWdaSue",
    email: "ohtugrappa2@gmail.com",
    role: "professor",
    isActive: true,
    isRetired: false,
    StudyFieldId: 1,
  }),
  models.User.create({
    firstname: "Three",
    lastname: "Prof",
    passwordHash: "$2a$10$Fs0N7KD/xUH4NAfW2s1MoOh/yH3G7mAtGycMY5tMUvCGqiWWdaSue",
    email: "ohtugrappa3@gmail.com",
    role: "professor",
    isActive: true,
    isRetired: false,
    StudyFieldId: 2,
  }),
  models.User.create({
    firstname: "Four",
    lastname: "Instructor",
    passwordHash: "$2a$10$Fs0N7KD/xUH4NAfW2s1MoOh/yH3G7mAtGycMY5tMUvCGqiWWdaSue",
    email: "ohtugrappa4@gmail.com",
    role: "instructor",
    isActive: true,
    isRetired: false,
    StudyFieldId: 1,
  }),
  models.User.create({
    firstname: "Five",
    lastname: "Instructor",
    passwordHash: "$2a$10$Fs0N7KD/xUH4NAfW2s1MoOh/yH3G7mAtGycMY5tMUvCGqiWWdaSue",
    email: "ohtugrappa5@gmail.com",
    role: "instructor",
    isActive: true,
    isRetired: false,
    StudyFieldId: 2,
  }),
  models.User.create({
    firstname: "Six",
    lastname: "Print-person",
    passwordHash: "$2a$10$Fs0N7KD/xUH4NAfW2s1MoOh/yH3G7mAtGycMY5tMUvCGqiWWdaSue",
    email: "ohtugrappa6@gmail.com",
    role: "print-person",
    isActive: true,
    isRetired: false,
    StudyFieldId: null,
  }),
  models.CouncilMeeting.create({
    date: new Date("11/05/2016"),
  }),
  models.CouncilMeeting.create({
    date: new Date("12/06/2025"),
  }),
  models.Thesis.create({
    id: 1,
    author: "Test Author 1",
    email: "testauthor1@gmail.com",
    title: "Oliko Jeesus olemassa",
    urkund: "https://testurkund.com",
    ethesis: "https://helda.helsinki.fi/bitstream/handle/10138/166162/Gradu%20teksti%203.pdf?sequence=3",
    grade: "Laudatur",
    UserId: 4,
    StudyFieldId: 1,
    CouncilMeetingId: 1,
  }),
  models.EmailDraft.create({
    type: "EthesisReminder",
    title: "REMINDER: Submit your thesis to eThesis",
    body: "Hi\n\nThis is an automatic reminder from Grappa, https://grappa.cs.helsinki.fi, a web application created to help in managing the final stages of approving student's master's degree.\n\nPlease submit your thesis into eThesis https://ethesis.helsinki.fi/. And after submitting please copy the eThesis link to your thesis' PDF-file and enter it into the supplied field below.\n$LINK$",
  }),
  models.EmailDraft.create({
    type: "GraderEvalReminder",
    title: "REMINDER: Submit your evaluation",
    body: "Hi\n\nThis is an automatic reminder from Grappa, https://grappa.cs.helsinki.fi, a web application created to help in managing the final stages of approving student's master's degree.\n\nDue to rules of the process, your evaluation of the instructors is needed for the process to continue. Please submit your evaluation in the provided link.\n$LINK$",
  }),
  models.EmailDraft.create({
    type: "PrintReminder",
    title: "REMINDER: Theses are ready to print",
    body: "Hi\n\nThis is an automatic reminder from Grappa, a web application to help in managing the bureaucratic side of the processes related to the final stages of a students Masters degree.\n\nTheses for the next councilmeeting are ready to be printed at https://grappa.cs.helsinki.fi.",
  }),
]);
