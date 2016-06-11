module.exports.thesis = {
  id: 2000,
  authorFirstname: "Pekka",
  authorLastname: "Graduttaja",
  authorEmail: "ohtugrappa@gmail.com",
  title: "Oliko Jeesus olemassa",
  urkund: "urkunlinkki.com",
  ethesis: "ethesislinkki.com",
  abstract: "Abstract from ethesis blaablaa",
  grade: "Laudatur",
  deadline: "2016-04-15T08:51:01.894Z",
  StudyFieldName: "Software Systems",
  graders:
  [{ name: "PENTTI", title: "AdjProf" },
  { name: "VERTTI", title: "Prof" }],
};

module.exports.thesisFromFrontend = {
  authorFirstname: "Pekka",
  authorLastname: "Graduttaja",
  authorEmail: "ohtugrappa@gmail.com",
  title: "Oliko Jeesus olemassa",
  urkund: "",
  ethesis: "",
  grade: "Laudatur",
  StudyFieldId: 1,
  CouncilMeetingId: 1,
  graders:
  [{ name: "PENTTI", title: "AdjProf" },
  { name: "VERTTI", title: "Prof" }],
};

module.exports.theses = [{
  id: 1,
  authorFirstname: "Pekka",
  authorLastname: "Graduttaja",
  authorEmail: "ohtugrappa@gmail.com",
  title: "Oliko Jeesus olemassa",
  urkund: "urkunlinkki.com",
  ethesis: "ethesislinkki.com",
  abstract: "Abstract from ethesis blaablaa",
  grade: "Laudatur",
  deadline: null,
  createdAt: "2016-04-15T08:51:01.890Z",
  updatedAt: "2016-04-15T08:51:01.890Z",
  StudyFieldId: 1,
  CouncilMeetingId: null,
  UserId: 2,
}, {
  id: 2,
  authorFirstname: "Pekka",
  authorLastname: "Graduttaja",
  authorEmail: "ohtugrappa@gmail.com",
  title: null,
  urkund: null,
  ethesis: null,
  abstract: null,
  grade: null,
  deadline: null,
  createdAt: "2016-04-15T11:07:20.524Z",
  updatedAt: "2016-04-15T11:07:20.524Z",
  StudyFieldId: 2,
  CouncilMeetingId: null,
  UserId: 4,
}, {
  id: 3,
  authorFirstname: "Pekka",
  authorLastname: "Graduttaja",
  authorEmail: "ohtugrappa@gmail.com",
  title: null,
  urkund: null,
  ethesis: null,
  abstract: null,
  grade: "Laudatur",
  deadline: null,
  createdAt: "2016-04-15T11:22:29.507Z",
  updatedAt: "2016-04-15T11:22:29.507Z",
  StudyFieldId: 3,
  CouncilMeetingId: null,
  UserId: 4,
}];

module.exports.councilmeeting = {
  id: 1,
  date: "2016-04-15T08:51:01.894Z",
  createdAt: "2016-04-15T08:51:01.895Z",
  updatedAt: "2016-04-15T08:51:01.895Z",
};

module.exports.councilmeetings = [
  {
    id: 1,
    date: "2016-04-15T08:51:01.894Z",
    createdAt: "2016-04-15T08:51:01.895Z",
    updatedAt: "2016-04-15T08:51:01.895Z",
  },
];

module.exports.thesisProgress = {
  id: 30,
  thesisId: 2000,
  ethesisReminder: null,
  "professorReminder": null,
  "gradersStatus": false,
  "documentsSent": null,
  "isDone": false,
  "createdAt": "2016-04-18T11:12:51.865Z",
  "updatedAt": "2016-04-18T11:12:51.865Z",
};

module.exports.thesisProgresses = [{
  id: 30,
  thesisId: 2000,
  ethesisReminder: null,
  "professorReminder": null,
  "gradersStatus": false,
  "documentsSent": null,
  "isDone": false,
  "createdAt": "2016-04-18T11:12:51.865Z",
  "updatedAt": "2016-04-18T11:12:51.865Z",
}
, {
  id: 31,
  thesisId: 2000,
  ethesisReminder: null,
  "professorReminder": null,
  "gradersStatus": false,
  "documentsSent": null,
  "isDone": false,
  "createdAt": "2016-04-18T11:14:28.003Z",
  "updatedAt": "2016-04-18T11:14:28.003Z",
}, {
  id: 32,
  thesisId: 2000,
  ethesisReminder: null,
  "professorReminder": null,
  "gradersStatus": false,
  "documentsSent": null,
  "isDone": false,
  "createdAt": "2016-04-18T11:14:28.003Z",
  "updatedAt": "2016-04-18T11:14:28.003Z",
}];

module.exports.competentGraders = [{
  name: "PENTTI", title: "AdjProf",
}, {
  name: "VERTTI", title: "Prof",
}, {
  name: "LERTTI", title: "AssProf",
}, {
  name: "PERTTI", title: "Other",
}, {
  name: "KERTTU", title: "AdjProf",
}];

module.exports.incompetentGraders = [{
  name: "PENTTI", title: "AdjProf",
}, {
  name: "VERTTI", title: "AssProf",
}, {
  name: "LERTTI", title: "AssProf",
}, {
  name: "PERTTI", title: "Other",
}, {
  name: "KERTTU", title: "Doc",
}];

module.exports.studyfields = [{
  id: 1,
  "name": "Algorithmic Bioinformatics",
  "createdAt": "2016-04-21T08:38:47.440Z",
  "updatedAt": "2016-04-21T08:38:47.440Z",
}, {
  id: 2,
  "name": "Algorithms, Data Analytics and Machine Learning",
  "createdAt": "2016-04-21T08:38:47.442Z",
  "updatedAt": "2016-04-21T08:38:47.442Z",
}, {
  id: 3,
  "name": "Networking and Services",
  "createdAt": "2016-04-21T08:38:47.443Z",
  "updatedAt": "2016-04-21T08:38:47.443Z",
}, {
  id: 4,
  "name": "Software Systems",
  "createdAt": "2016-04-21T08:38:47.443Z",
  "updatedAt": "2016-04-21T08:38:47.443Z",
}];

module.exports.reviews = [{
  id: 1,
  "authoredByProf": null,
  "text": "Sup dawg.",
  "createdAt": "2016-04-21T08:38:47.451Z",
  "updatedAt": "2016-04-21T08:38:47.451Z",
  "ThesisId": 1,
  "UserId": 3,
}, {
  id: 2,
  "authoredByProf": null,
  "text": "Aika heikko suoritus. Arvioijat täysin ala-arvoisia.",
  "createdAt": "2016-04-21T08:38:47.452Z",
  "updatedAt": "2016-04-21T08:38:47.452Z",
  "ThesisId": 2,
  "UserId": 4,
}];

module.exports.users = [
  {
    id: 1,
    name: "Kjell Lemström",
    password: "moro",
    passwordHash: "$2a$10$mVhq5OchvjtHoZ0ZOvGimO/f/5H9yt22.6iqIG2.mh36qNA6mgshS",
    email: "moikkamoi",
    role: "admin",
    StudyFieldId: null,
    isActive: true,
  },
  {
    id: 2,
    name: "B Virtanen",
    password: "asdf",
    email: "ohtugrappa2@gmail.com",
    role: "print-person",
    StudyFieldId: null,
    isActive: false,

  },
  {
    id: 3,
    name: "Tohtori Sykerö",
    password: "asdfasdf",
    email: "ohtugrappa3@gmail.com",
    role: "professor",
    StudyFieldId: 1,
    isActive: true,

  },
  {
    id: 4,
    name: "Tohtori Outolempi",
    password: "asdfasdf",
    email: "ohtugrappa4@gmail.com",
    role: "professor",
    StudyFieldId: 2,
    isActive: true,
  },
  {
    id: 5,
    name: "Alikersantti Rokka",
    password: "asdfasdfasdf",
    email: "ohtugrappa5@gmail.com",
    role: "instructor",
    StudyFieldId: 1,
    isActive: true,

  },
  {
    id: 6,
    name: "Vänrikki Koskela",
    password: "asdfasdfasdf",
    email: "ohtugrappa6@gmail.com",
    role: "instructor",
    StudyFieldId: 2,
    isActive: true,
  },
];

module.exports.users_admin = module.exports.users[0];

module.exports.users_printperson = module.exports.users[1];
