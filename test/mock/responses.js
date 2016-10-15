const _ = require("lodash");

const expect = require("chai").expect;

module.exports = (route, method, role) => (res) => {
  // console.log(JSON.stringify(res.body));
  const response = _.get(responses, `${route}.${method}.${role}`);
  expect(_.isEqual(res.body, response)).to.be.true;
}

const responses = {
  thesis: {
    get: {
      admin: {},
      professor: {},
    }
  }
};

responses.thesis.get.admin = [
  {
    "id": 1,
    "authorFirstname": "First",
    "authorLastname": "Author",
    "authorEmail": "firstauthor@asdf.test",
    "title": "Onko Jumalaa?",
    "urkund": "https://test.urkund.fi",
    "ethesis": null,
    "grade": "Approbatur",
    "deadline": "2016-09-18T20:59:59.000Z",
    "graderEval": null,
    "CouncilMeetingId": 1,
    "StudyFieldId": 1,
    "UserId": 4,
    "Graders": [
      {
        "id": 1,
        "name": "First Grader",
        "title": "Prof",
        "GraderThesis": {
          "createdAt": "2016-09-02T10:48:19.696Z",
          "updatedAt": "2016-09-02T10:48:19.696Z",
          "ThesisId": 1,
          "GraderId": 1
        }
      },
      {
        "id": 2,
        "name": "Second Grader",
        "title": "AssProf",
        "GraderThesis": {
          "createdAt": "2016-09-02T10:48:19.696Z",
          "updatedAt": "2016-09-02T10:48:19.696Z",
          "ThesisId": 1,
          "GraderId": 2
        }
      }
    ],
    "ThesisProgress": {
      "id": 1,
      "ethesisDone": false,
      "graderEvalDone": true,
      "printDone": false,
      "createdAt": "2016-09-02T10:48:18.906Z",
      "updatedAt": "2016-09-02T10:48:20.128Z",
      "EthesisEmailId": 1,
      "GraderEvalEmailId": null,
      "PrintEmailId": null,
      "ThesisId": 1,
      "EthesisEmail": {
        "id": 1,
        "lastSent": "2016-09-02T10:48:19.696Z",
        "type": "EthesisReminder",
        "to": "firstauthor@asdf.test",
        "deadline": "2016-09-18T20:59:59.000Z",
        "wasError": false,
        "createdAt": "2016-09-02T10:48:19.696Z",
        "updatedAt": "2016-09-02T10:48:19.696Z",
        "EmailDraftId": 1
      },
      "GraderEvalEmail": null,
      "PrintEmail": null
    },
    "StudyField": {
      "id": 1,
      "name": "Algorithmic Bioinformatics",
      "isActive": true,
      "createdAt": "2016-08-19T13:14:38.233Z",
      "updatedAt": "2016-08-19T13:14:38.233Z"
    },
    "User": {
      "id": 4,
      "email": "ohtugrappa4@gmail.com",
      "firstname": "Fourth",
      "lastname": "Instructor",
      "role": "instructor",
      "StudyFieldId": 1
    },
    "CouncilMeeting": {
      "id": 1,
      "date": "2016-09-28T20:59:59.000Z",
      "createdAt": "2016-09-02T10:30:19.437Z",
      "updatedAt": "2016-09-02T10:30:19.437Z"
    }
  },
  {
    "id": 2,
    "authorFirstname": "Second",
    "authorLastname": "Author",
    "authorEmail": "secondauthor@asdf.test",
    "title": "Onko kaljaa?",
    "urkund": "https://test.urkund.fi",
    "ethesis": null,
    "grade": "Laudatur",
    "deadline": "2016-09-18T20:59:59.000Z",
    "graderEval": null,
    "CouncilMeetingId": 1,
    "StudyFieldId": 2,
    "UserId": 5,
    "Graders": [
      {
        "id": 1,
        "name": "First Grader",
        "title": "Prof",
        "GraderThesis": {
          "createdAt": "2016-09-02T10:51:54.695Z",
          "updatedAt": "2016-09-02T10:51:54.695Z",
          "ThesisId": 2,
          "GraderId": 1
        }
      },
      {
        "id": 3,
        "name": "Third Grader",
        "title": "Other",
        "GraderThesis": {
          "createdAt": "2016-09-02T10:51:54.695Z",
          "updatedAt": "2016-09-02T10:51:54.695Z",
          "ThesisId": 2,
          "GraderId": 3
        }
      }
    ],
    "ThesisProgress": {
      "id": 2,
      "ethesisDone": false,
      "graderEvalDone": false,
      "printDone": false,
      "createdAt": "2016-09-02T10:51:53.830Z",
      "updatedAt": "2016-09-02T10:51:55.196Z",
      "EthesisEmailId": 2,
      "GraderEvalEmailId": 3,
      "PrintEmailId": null,
      "ThesisId": 2,
      "EthesisEmail": {
        "id": 2,
        "lastSent": "2016-09-02T10:51:54.695Z",
        "type": "EthesisReminder",
        "to": "secondauthor@asdf.test",
        "deadline": "2016-09-18T20:59:59.000Z",
        "wasError": false,
        "createdAt": "2016-09-02T10:51:54.695Z",
        "updatedAt": "2016-09-02T10:51:54.695Z",
        "EmailDraftId": 1
      },
      "GraderEvalEmail": {
        "id": 3,
        "lastSent": "2016-09-02T10:51:55.089Z",
        "type": "GraderEvalReminder",
        "to": "ohtugrappa3@gmail.com",
        "deadline": "2016-09-18T20:59:59.000Z",
        "wasError": false,
        "createdAt": "2016-09-02T10:51:55.090Z",
        "updatedAt": "2016-09-02T10:51:55.090Z",
        "EmailDraftId": 2
      },
      "PrintEmail": null
    },
    "StudyField": {
      "id": 2,
      "name": "Algorithms, Data Analytics and Machine Learning",
      "isActive": true,
      "createdAt": "2016-08-19T13:14:38.249Z",
      "updatedAt": "2016-08-19T13:14:38.249Z"
    },
    "User": {
      "id": 5,
      "email": "ohtugrappa5@gmail.com",
      "firstname": "Fifth",
      "lastname": "Instructor",
      "role": "instructor",
      "StudyFieldId": 2
    },
    "CouncilMeeting": {
      "id": 1,
      "date": "2016-09-28T20:59:59.000Z",
      "createdAt": "2016-09-02T10:30:19.437Z",
      "updatedAt": "2016-09-02T10:30:19.437Z"
    }
  },
  {
    "id": 3,
    "authorFirstname": "Third",
    "authorLastname": "Author",
    "authorEmail": "thirdauthor@asdf.test",
    "title": "Missä on vessa?",
    "urkund": "https://test.urkund.fi",
    "ethesis": null,
    "grade": "Cum Laude Approbatur",
    "deadline": "2016-09-18T20:59:59.000Z",
    "graderEval": null,
    "CouncilMeetingId": 1,
    "StudyFieldId": 1,
    "UserId": 7,
    "Graders": [
      {
        "id": 2,
        "name": "Second Grader",
        "title": "AssProf",
        "GraderThesis": {
          "createdAt": "2016-09-02T10:57:28.669Z",
          "updatedAt": "2016-09-02T10:57:28.669Z",
          "ThesisId": 3,
          "GraderId": 2
        }
      },
      {
        "id": 3,
        "name": "Third Grader",
        "title": "Other",
        "GraderThesis": {
          "createdAt": "2016-09-02T10:57:28.669Z",
          "updatedAt": "2016-09-02T10:57:28.669Z",
          "ThesisId": 3,
          "GraderId": 3
        }
      }
    ],
    "ThesisProgress": {
      "id": 3,
      "ethesisDone": false,
      "graderEvalDone": false,
      "printDone": false,
      "createdAt": "2016-09-02T10:57:27.892Z",
      "updatedAt": "2016-09-02T10:57:29.125Z",
      "EthesisEmailId": 4,
      "GraderEvalEmailId": 5,
      "PrintEmailId": null,
      "ThesisId": 3,
      "EthesisEmail": {
        "id": 4,
        "lastSent": "2016-09-02T10:57:28.329Z",
        "type": "EthesisReminder",
        "to": "thirdauthor@asdf.test",
        "deadline": "2016-09-18T20:59:59.000Z",
        "wasError": false,
        "createdAt": "2016-09-02T10:57:28.345Z",
        "updatedAt": "2016-09-02T10:57:28.345Z",
        "EmailDraftId": 1
      },
      "GraderEvalEmail": {
        "id": 5,
        "lastSent": "2016-09-02T10:57:29.029Z",
        "type": "GraderEvalReminder",
        "to": "ohtugrappa2@gmail.com",
        "deadline": "2016-09-18T20:59:59.000Z",
        "wasError": false,
        "createdAt": "2016-09-02T10:57:29.029Z",
        "updatedAt": "2016-09-02T10:57:29.029Z",
        "EmailDraftId": 2
      },
      "PrintEmail": null
    },
    "StudyField": {
      "id": 1,
      "name": "Algorithmic Bioinformatics",
      "isActive": true,
      "createdAt": "2016-08-19T13:14:38.233Z",
      "updatedAt": "2016-08-19T13:14:38.233Z"
    },
    "User": {
      "id": 7,
      "email": "ohtugrappa6@gmail.com",
      "firstname": "Sixth",
      "lastname": "Instructor",
      "role": "instructor",
      "StudyFieldId": 1
    },
    "CouncilMeeting": {
      "id": 1,
      "date": "2016-09-28T20:59:59.000Z",
      "createdAt": "2016-09-02T10:30:19.437Z",
      "updatedAt": "2016-09-02T10:30:19.437Z"
    }
  }
];

responses.thesis.get.professor = [
  {
    "id": 1,
    "authorFirstname": "First",
    "authorLastname": "Author",
    "authorEmail": "firstauthor@asdf.test",
    "title": "Onko Jumalaa?",
    "urkund": "https://test.urkund.fi",
    "ethesis": null,
    "grade": "Approbatur",
    "deadline": "2016-09-18T20:59:59.000Z",
    "graderEval": null,
    "CouncilMeetingId": 1,
    "StudyFieldId": 1,
    "UserId": 4,
    "Graders": [
      {
        "id": 1,
        "name": "First Grader",
        "title": "Prof",
        "GraderThesis": {
          "createdAt": "2016-09-02T10:48:19.696Z",
          "updatedAt": "2016-09-02T10:48:19.696Z",
          "ThesisId": 1,
          "GraderId": 1
        }
      },
      {
        "id": 2,
        "name": "Second Grader",
        "title": "AssProf",
        "GraderThesis": {
          "createdAt": "2016-09-02T10:48:19.696Z",
          "updatedAt": "2016-09-02T10:48:19.696Z",
          "ThesisId": 1,
          "GraderId": 2
        }
      }
    ],
    "ThesisProgress": {
      "id": 1,
      "ethesisDone": false,
      "graderEvalDone": true,
      "printDone": false,
      "createdAt": "2016-09-02T10:48:18.906Z",
      "updatedAt": "2016-09-02T10:48:20.128Z",
      "EthesisEmailId": 1,
      "GraderEvalEmailId": null,
      "PrintEmailId": null,
      "ThesisId": 1,
      "EthesisEmail": {
        "id": 1,
        "lastSent": "2016-09-02T10:48:19.696Z",
        "type": "EthesisReminder",
        "to": "firstauthor@asdf.test",
        "deadline": "2016-09-18T20:59:59.000Z",
        "wasError": false,
        "createdAt": "2016-09-02T10:48:19.696Z",
        "updatedAt": "2016-09-02T10:48:19.696Z",
        "EmailDraftId": 1
      },
      "GraderEvalEmail": null,
      "PrintEmail": null
    },
    "StudyField": {
      "id": 1,
      "name": "Algorithmic Bioinformatics",
      "isActive": true,
      "createdAt": "2016-08-19T13:14:38.233Z",
      "updatedAt": "2016-08-19T13:14:38.233Z"
    },
    "User": {
      "id": 4,
      "email": "ohtugrappa4@gmail.com",
      "firstname": "Fourth",
      "lastname": "Instructor",
      "role": "instructor",
      "StudyFieldId": 1
    },
    "CouncilMeeting": {
      "id": 1,
      "date": "2016-09-28T20:59:59.000Z",
      "createdAt": "2016-09-02T10:30:19.437Z",
      "updatedAt": "2016-09-02T10:30:19.437Z"
    }
  },
  {
    "id": 3,
    "authorFirstname": "Third",
    "authorLastname": "Author",
    "authorEmail": "thirdauthor@asdf.test",
    "title": "Missä on vessa?",
    "urkund": "https://test.urkund.fi",
    "ethesis": null,
    "grade": "Cum Laude Approbatur",
    "deadline": "2016-09-18T20:59:59.000Z",
    "graderEval": null,
    "CouncilMeetingId": 1,
    "StudyFieldId": 1,
    "UserId": 7,
    "Graders": [
      {
        "id": 2,
        "name": "Second Grader",
        "title": "AssProf",
        "GraderThesis": {
          "createdAt": "2016-09-02T10:57:28.669Z",
          "updatedAt": "2016-09-02T10:57:28.669Z",
          "ThesisId": 3,
          "GraderId": 2
        }
      },
      {
        "id": 3,
        "name": "Third Grader",
        "title": "Other",
        "GraderThesis": {
          "createdAt": "2016-09-02T10:57:28.669Z",
          "updatedAt": "2016-09-02T10:57:28.669Z",
          "ThesisId": 3,
          "GraderId": 3
        }
      }
    ],
    "ThesisProgress": {
      "id": 3,
      "ethesisDone": false,
      "graderEvalDone": false,
      "printDone": false,
      "createdAt": "2016-09-02T10:57:27.892Z",
      "updatedAt": "2016-09-02T10:57:29.125Z",
      "EthesisEmailId": 4,
      "GraderEvalEmailId": 5,
      "PrintEmailId": null,
      "ThesisId": 3,
      "EthesisEmail": {
        "id": 4,
        "lastSent": "2016-09-02T10:57:28.329Z",
        "type": "EthesisReminder",
        "to": "thirdauthor@asdf.test",
        "deadline": "2016-09-18T20:59:59.000Z",
        "wasError": false,
        "createdAt": "2016-09-02T10:57:28.345Z",
        "updatedAt": "2016-09-02T10:57:28.345Z",
        "EmailDraftId": 1
      },
      "GraderEvalEmail": {
        "id": 5,
        "lastSent": "2016-09-02T10:57:29.029Z",
        "type": "GraderEvalReminder",
        "to": "ohtugrappa2@gmail.com",
        "deadline": "2016-09-18T20:59:59.000Z",
        "wasError": false,
        "createdAt": "2016-09-02T10:57:29.029Z",
        "updatedAt": "2016-09-02T10:57:29.029Z",
        "EmailDraftId": 2
      },
      "PrintEmail": null
    },
    "StudyField": {
      "id": 1,
      "name": "Algorithmic Bioinformatics",
      "isActive": true,
      "createdAt": "2016-08-19T13:14:38.233Z",
      "updatedAt": "2016-08-19T13:14:38.233Z"
    },
    "User": {
      "id": 7,
      "email": "ohtugrappa6@gmail.com",
      "firstname": "Sixth",
      "lastname": "Instructor",
      "role": "instructor",
      "StudyFieldId": 1
    },
    "CouncilMeeting": {
      "id": 1,
      "date": "2016-09-28T20:59:59.000Z",
      "createdAt": "2016-09-02T10:30:19.437Z",
      "updatedAt": "2016-09-02T10:30:19.437Z"
    }
  }
];

responses.thesis.get.instructor = [
  {
    "id": 1,
    "authorFirstname": "First",
    "authorLastname": "Author",
    "authorEmail": "firstauthor@asdf.test",
    "title": "Onko Jumalaa?",
    "urkund": "https://test.urkund.fi",
    "ethesis": null,
    "grade": "Approbatur",
    "deadline": "2016-09-18T20:59:59.000Z",
    "graderEval": null,
    "CouncilMeetingId": 1,
    "StudyFieldId": 1,
    "UserId": 4,
    "Graders": [
      {
        "id": 1,
        "name": "First Grader",
        "title": "Prof",
        "GraderThesis": {
          "createdAt": "2016-09-02T10:48:19.696Z",
          "updatedAt": "2016-09-02T10:48:19.696Z",
          "ThesisId": 1,
          "GraderId": 1
        }
      },
      {
        "id": 2,
        "name": "Second Grader",
        "title": "AssProf",
        "GraderThesis": {
          "createdAt": "2016-09-02T10:48:19.696Z",
          "updatedAt": "2016-09-02T10:48:19.696Z",
          "ThesisId": 1,
          "GraderId": 2
        }
      }
    ],
    "ThesisProgress": {
      "id": 1,
      "ethesisDone": false,
      "graderEvalDone": true,
      "printDone": false,
      "createdAt": "2016-09-02T10:48:18.906Z",
      "updatedAt": "2016-09-02T10:48:20.128Z",
      "EthesisEmailId": 1,
      "GraderEvalEmailId": null,
      "PrintEmailId": null,
      "ThesisId": 1,
      "EthesisEmail": {
        "id": 1,
        "lastSent": "2016-09-02T10:48:19.696Z",
        "type": "EthesisReminder",
        "to": "firstauthor@asdf.test",
        "deadline": "2016-09-18T20:59:59.000Z",
        "wasError": false,
        "createdAt": "2016-09-02T10:48:19.696Z",
        "updatedAt": "2016-09-02T10:48:19.696Z",
        "EmailDraftId": 1
      },
      "GraderEvalEmail": null,
      "PrintEmail": null
    },
    "StudyField": {
      "id": 1,
      "name": "Algorithmic Bioinformatics",
      "isActive": true,
      "createdAt": "2016-08-19T13:14:38.233Z",
      "updatedAt": "2016-08-19T13:14:38.233Z"
    },
    "User": {
      "id": 4,
      "email": "ohtugrappa4@gmail.com",
      "firstname": "Fourth",
      "lastname": "Instructor",
      "role": "instructor",
      "StudyFieldId": 1
    },
    "CouncilMeeting": {
      "id": 1,
      "date": "2016-09-28T20:59:59.000Z",
      "createdAt": "2016-09-02T10:30:19.437Z",
      "updatedAt": "2016-09-02T10:30:19.437Z"
    }
  },
];