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
      instructor: {},
    }
  }
};

responses.thesis.get.admin = [
    {
        "id": 1,
        "authorFirstname": "1",
        "authorLastname": "Author",
        "authorEmail": "1@author.test",
        "title": "T",
        "urkund": "https://secure.urkund.com",
        "grade": "Approbatur",
        "graderEval": null,
        "CouncilMeetingId": 1,
        "StudyFieldId": 1,
        "UserId": 2,
        "regreq": null,
        "Graders": [
            {
                "id": 1,
                "name": "Arto Wikla",
                "title": "Prof",
                "GraderThesis": {
                    "createdAt": "2016-11-02T15:21:00.934Z",
                    "updatedAt": "2016-11-02T15:21:00.934Z",
                    "ThesisId": 1,
                    "GraderId": 1
                }
            },
            {
                "id": 2,
                "name": "Arto Vihavainen",
                "title": "Doc",
                "GraderThesis": {
                    "createdAt": "2016-11-02T15:21:00.933Z",
                    "updatedAt": "2016-11-02T15:21:00.933Z",
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
            "studentNotificationSent": null,
            "createdAt": "2016-11-02T15:21:00.213Z",
            "updatedAt": "2016-11-02T15:21:01.413Z",
            "EthesisReminderId": 1,
            "GraderEvalReminderId": null,
            "PrintReminderId": null,
            "ThesisId": 1,
            "EthesisReminder": {
                "id": 1,
                "lastSent": "2016-11-02T15:21:01.303Z",
                "type": "EthesisReminder",
                "to": "1@author.test",
                "wasError": false,
                "createdAt": "2016-11-02T15:21:01.304Z",
                "updatedAt": "2016-11-02T15:21:01.304Z",
                "EmailDraftId": 6,
                "ThesisId": 1
            },
            "GraderEvalReminder": null,
            "PrintReminder": null
        },
        "StudyField": {
            "id": 1,
            "name": "Algorithmic Bioinformatics",
            "isActive": true,
            "createdAt": "2016-11-02T15:13:17.030Z",
            "updatedAt": "2016-11-02T15:13:17.030Z"
        },
        "User": {
            "id": 2,
            "email": "1@test.test",
            "firstname": "1",
            "lastname": "Admin",
            "role": "admin",
            "StudyFieldId": null
        },
        "CouncilMeeting": {
            "id": 1,
            "date": "2116-11-29T22:00:00.000Z",
            "studentDeadline": "2116-11-24T22:00:00.000Z",
            "instructorDeadline": "2116-11-19T22:00:00.000Z",
            "createdAt": "2016-11-02T15:13:17.061Z",
            "updatedAt": "2016-11-02T15:13:17.061Z"
        }
    },
    {
        "id": 2,
        "authorFirstname": "2",
        "authorLastname": "Author",
        "authorEmail": "2@author.test",
        "title": "T",
        "urkund": "https://secure.urkund.com",
        "grade": "Cum Laude Approbatur",
        "graderEval": null,
        "CouncilMeetingId": 1,
        "StudyFieldId": 1,
        "UserId": 4,
        "regreq": null,
        "Graders": [
            {
                "id": 1,
                "name": "Arto Wikla",
                "title": "Prof",
                "GraderThesis": {
                    "createdAt": "2016-11-02T15:23:22.666Z",
                    "updatedAt": "2016-11-02T15:23:22.666Z",
                    "ThesisId": 2,
                    "GraderId": 1
                }
            },
            {
                "id": 2,
                "name": "Arto Vihavainen",
                "title": "Doc",
                "GraderThesis": {
                    "createdAt": "2016-11-02T15:23:22.675Z",
                    "updatedAt": "2016-11-02T15:23:22.675Z",
                    "ThesisId": 2,
                    "GraderId": 2
                }
            },
            {
                "id": 3,
                "name": "Grader3",
                "title": "AdjProf",
                "GraderThesis": {
                    "createdAt": "2016-11-02T15:23:22.671Z",
                    "updatedAt": "2016-11-02T15:23:22.671Z",
                    "ThesisId": 2,
                    "GraderId": 3
                }
            }
        ],
        "ThesisProgress": {
            "id": 2,
            "ethesisDone": false,
            "graderEvalDone": true,
            "printDone": false,
            "studentNotificationSent": null,
            "createdAt": "2016-11-02T15:23:21.827Z",
            "updatedAt": "2016-11-02T15:23:23.221Z",
            "EthesisReminderId": 2,
            "GraderEvalReminderId": null,
            "PrintReminderId": null,
            "ThesisId": 2,
            "EthesisReminder": {
                "id": 2,
                "lastSent": "2016-11-02T15:23:23.116Z",
                "type": "EthesisReminder",
                "to": "2@author.test",
                "wasError": false,
                "createdAt": "2016-11-02T15:23:23.117Z",
                "updatedAt": "2016-11-02T15:23:23.117Z",
                "EmailDraftId": 6,
                "ThesisId": 2
            },
            "GraderEvalReminder": null,
            "PrintReminder": null
        },
        "StudyField": {
            "id": 1,
            "name": "Algorithmic Bioinformatics",
            "isActive": true,
            "createdAt": "2016-11-02T15:13:17.030Z",
            "updatedAt": "2016-11-02T15:13:17.030Z"
        },
        "User": {
            "id": 4,
            "email": "3@test.test",
            "firstname": "3",
            "lastname": "Professor",
            "role": "professor",
            "StudyFieldId": 4
        },
        "CouncilMeeting": {
            "id": 1,
            "date": "2116-11-29T22:00:00.000Z",
            "studentDeadline": "2116-11-24T22:00:00.000Z",
            "instructorDeadline": "2116-11-19T22:00:00.000Z",
            "createdAt": "2016-11-02T15:13:17.061Z",
            "updatedAt": "2016-11-02T15:13:17.061Z"
        }
    },
    {
        "id": 3,
        "authorFirstname": "3",
        "authorLastname": "Author",
        "authorEmail": "3@author.test",
        "title": "T",
        "urkund": "https://secure.urkund.com",
        "grade": "Lubenter Approbatur",
        "graderEval": null,
        "CouncilMeetingId": 1,
        "StudyFieldId": 4,
        "UserId": 5,
        "regreq": null,
        "Graders": [
            {
                "id": 2,
                "name": "Arto Vihavainen",
                "title": "Doc",
                "GraderThesis": {
                    "createdAt": "2016-11-02T15:24:43.762Z",
                    "updatedAt": "2016-11-02T15:24:43.762Z",
                    "ThesisId": 3,
                    "GraderId": 2
                }
            },
            {
                "id": 3,
                "name": "Grader3",
                "title": "AdjProf",
                "GraderThesis": {
                    "createdAt": "2016-11-02T15:24:43.761Z",
                    "updatedAt": "2016-11-02T15:24:43.761Z",
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
            "studentNotificationSent": null,
            "createdAt": "2016-11-02T15:24:42.633Z",
            "updatedAt": "2016-11-02T15:24:44.211Z",
            "EthesisReminderId": 3,
            "GraderEvalReminderId": 4,
            "PrintReminderId": null,
            "ThesisId": 3,
            "EthesisReminder": {
                "id": 3,
                "lastSent": "2016-11-02T15:24:44.011Z",
                "type": "EthesisReminder",
                "to": "3@author.test",
                "wasError": false,
                "createdAt": "2016-11-02T15:24:44.012Z",
                "updatedAt": "2016-11-02T15:24:44.012Z",
                "EmailDraftId": 6,
                "ThesisId": 3
            },
            "GraderEvalReminder": {
                "id": 4,
                "lastSent": "2016-11-02T15:24:44.017Z",
                "type": "GraderEvalReminder",
                "to": "3@test.test",
                "wasError": false,
                "createdAt": "2016-11-02T15:24:44.017Z",
                "updatedAt": "2016-11-02T15:24:44.017Z",
                "EmailDraftId": 7,
                "ThesisId": 3
            },
            "PrintReminder": null
        },
        "StudyField": {
            "id": 4,
            "name": "Software Systems",
            "isActive": true,
            "createdAt": "2016-11-02T15:13:17.033Z",
            "updatedAt": "2016-11-02T15:13:17.033Z"
        },
        "User": {
            "id": 5,
            "email": "4@test.test",
            "firstname": "4",
            "lastname": "Instructor",
            "role": "instructor",
            "StudyFieldId": null
        },
        "CouncilMeeting": {
            "id": 1,
            "date": "2116-11-29T22:00:00.000Z",
            "studentDeadline": "2116-11-24T22:00:00.000Z",
            "instructorDeadline": "2116-11-19T22:00:00.000Z",
            "createdAt": "2016-11-02T15:13:17.061Z",
            "updatedAt": "2016-11-02T15:13:17.061Z"
        }
    },
    {
        "id": 4,
        "authorFirstname": "4",
        "authorLastname": "Author",
        "authorEmail": "4@author.test",
        "title": "T",
        "urkund": "https://secure.urkund.com",
        "grade": "Laudatur",
        "graderEval": null,
        "CouncilMeetingId": 2,
        "StudyFieldId": 1,
        "UserId": 6,
        "regreq": null,
        "Graders": [
            {
                "id": 1,
                "name": "Arto Wikla",
                "title": "Prof",
                "GraderThesis": {
                    "createdAt": "2016-11-02T15:26:23.685Z",
                    "updatedAt": "2016-11-02T15:26:23.685Z",
                    "ThesisId": 4,
                    "GraderId": 1
                }
            },
            {
                "id": 2,
                "name": "Arto Vihavainen",
                "title": "Doc",
                "GraderThesis": {
                    "createdAt": "2016-11-02T15:26:23.684Z",
                    "updatedAt": "2016-11-02T15:26:23.684Z",
                    "ThesisId": 4,
                    "GraderId": 2
                }
            },
            {
                "id": 4,
                "name": "Grader4",
                "title": "Other",
                "GraderThesis": {
                    "createdAt": "2016-11-02T15:26:23.683Z",
                    "updatedAt": "2016-11-02T15:26:23.683Z",
                    "ThesisId": 4,
                    "GraderId": 4
                }
            }
        ],
        "ThesisProgress": {
            "id": 4,
            "ethesisDone": false,
            "graderEvalDone": true,
            "printDone": false,
            "studentNotificationSent": null,
            "createdAt": "2016-11-02T15:26:22.901Z",
            "updatedAt": "2016-11-02T15:26:24.357Z",
            "EthesisReminderId": 5,
            "GraderEvalReminderId": null,
            "PrintReminderId": null,
            "ThesisId": 4,
            "EthesisReminder": {
                "id": 5,
                "lastSent": "2016-11-02T15:26:24.262Z",
                "type": "EthesisReminder",
                "to": "4@author.test",
                "wasError": false,
                "createdAt": "2016-11-02T15:26:24.262Z",
                "updatedAt": "2016-11-02T15:26:24.262Z",
                "EmailDraftId": 6,
                "ThesisId": 4
            },
            "GraderEvalReminder": null,
            "PrintReminder": null
        },
        "StudyField": {
            "id": 1,
            "name": "Algorithmic Bioinformatics",
            "isActive": true,
            "createdAt": "2016-11-02T15:13:17.030Z",
            "updatedAt": "2016-11-02T15:13:17.030Z"
        },
        "User": {
            "id": 6,
            "email": "5@test.test",
            "firstname": "5",
            "lastname": "Instructor",
            "role": "instructor",
            "StudyFieldId": null
        },
        "CouncilMeeting": {
            "id": 2,
            "date": "2116-12-25T21:59:59.000Z",
            "studentDeadline": "2116-11-19T21:59:59.000Z",
            "instructorDeadline": "2116-11-17T21:59:59.000Z",
            "createdAt": "2016-11-02T15:19:14.050Z",
            "updatedAt": "2016-11-02T15:19:14.050Z"
        }
    }
];

responses.thesis.get.professor = [
    {
        "id": 1,
        "authorFirstname": "1",
        "authorLastname": "Author",
        "authorEmail": "1@author.test",
        "title": "T",
        "urkund": "https://secure.urkund.com",
        "grade": "Approbatur",
        "graderEval": null,
        "CouncilMeetingId": 1,
        "StudyFieldId": 1,
        "UserId": 2,
        "regreq": null,
        "Graders": [
            {
                "id": 1,
                "name": "Arto Wikla",
                "title": "Prof",
                "GraderThesis": {
                    "createdAt": "2016-11-02T15:21:00.934Z",
                    "updatedAt": "2016-11-02T15:21:00.934Z",
                    "ThesisId": 1,
                    "GraderId": 1
                }
            },
            {
                "id": 2,
                "name": "Arto Vihavainen",
                "title": "Doc",
                "GraderThesis": {
                    "createdAt": "2016-11-02T15:21:00.933Z",
                    "updatedAt": "2016-11-02T15:21:00.933Z",
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
            "studentNotificationSent": null,
            "createdAt": "2016-11-02T15:21:00.213Z",
            "updatedAt": "2016-11-02T15:21:01.413Z",
            "EthesisReminderId": 1,
            "GraderEvalReminderId": null,
            "PrintReminderId": null,
            "ThesisId": 1,
            "EthesisReminder": {
                "id": 1,
                "lastSent": "2016-11-02T15:21:01.303Z",
                "type": "EthesisReminder",
                "to": "1@author.test",
                "wasError": false,
                "createdAt": "2016-11-02T15:21:01.304Z",
                "updatedAt": "2016-11-02T15:21:01.304Z",
                "EmailDraftId": 6,
                "ThesisId": 1
            },
            "GraderEvalReminder": null,
            "PrintReminder": null
        },
        "StudyField": {
            "id": 1,
            "name": "Algorithmic Bioinformatics",
            "isActive": true,
            "createdAt": "2016-11-02T15:13:17.030Z",
            "updatedAt": "2016-11-02T15:13:17.030Z"
        },
        "User": {
            "id": 2,
            "email": "1@test.test",
            "firstname": "1",
            "lastname": "Admin",
            "role": "admin",
            "StudyFieldId": null
        },
        "CouncilMeeting": {
            "id": 1,
            "date": "2116-11-29T22:00:00.000Z",
            "studentDeadline": "2116-11-24T22:00:00.000Z",
            "instructorDeadline": "2116-11-19T22:00:00.000Z",
            "createdAt": "2016-11-02T15:13:17.061Z",
            "updatedAt": "2016-11-02T15:13:17.061Z"
        }
    },
    {
        "id": 2,
        "authorFirstname": "2",
        "authorLastname": "Author",
        "authorEmail": "2@author.test",
        "title": "T",
        "urkund": "https://secure.urkund.com",
        "grade": "Cum Laude Approbatur",
        "graderEval": null,
        "CouncilMeetingId": 1,
        "StudyFieldId": 1,
        "UserId": 4,
        "regreq": null,
        "Graders": [
            {
                "id": 1,
                "name": "Arto Wikla",
                "title": "Prof",
                "GraderThesis": {
                    "createdAt": "2016-11-02T15:23:22.666Z",
                    "updatedAt": "2016-11-02T15:23:22.666Z",
                    "ThesisId": 2,
                    "GraderId": 1
                }
            },
            {
                "id": 2,
                "name": "Arto Vihavainen",
                "title": "Doc",
                "GraderThesis": {
                    "createdAt": "2016-11-02T15:23:22.675Z",
                    "updatedAt": "2016-11-02T15:23:22.675Z",
                    "ThesisId": 2,
                    "GraderId": 2
                }
            },
            {
                "id": 3,
                "name": "Grader3",
                "title": "AdjProf",
                "GraderThesis": {
                    "createdAt": "2016-11-02T15:23:22.671Z",
                    "updatedAt": "2016-11-02T15:23:22.671Z",
                    "ThesisId": 2,
                    "GraderId": 3
                }
            }
        ],
        "ThesisProgress": {
            "id": 2,
            "ethesisDone": false,
            "graderEvalDone": true,
            "printDone": false,
            "studentNotificationSent": null,
            "createdAt": "2016-11-02T15:23:21.827Z",
            "updatedAt": "2016-11-02T15:23:23.221Z",
            "EthesisReminderId": 2,
            "GraderEvalReminderId": null,
            "PrintReminderId": null,
            "ThesisId": 2,
            "EthesisReminder": {
                "id": 2,
                "lastSent": "2016-11-02T15:23:23.116Z",
                "type": "EthesisReminder",
                "to": "2@author.test",
                "wasError": false,
                "createdAt": "2016-11-02T15:23:23.117Z",
                "updatedAt": "2016-11-02T15:23:23.117Z",
                "EmailDraftId": 6,
                "ThesisId": 2
            },
            "GraderEvalReminder": null,
            "PrintReminder": null
        },
        "StudyField": {
            "id": 1,
            "name": "Algorithmic Bioinformatics",
            "isActive": true,
            "createdAt": "2016-11-02T15:13:17.030Z",
            "updatedAt": "2016-11-02T15:13:17.030Z"
        },
        "User": {
            "id": 4,
            "email": "3@test.test",
            "firstname": "3",
            "lastname": "Professor",
            "role": "professor",
            "StudyFieldId": 4
        },
        "CouncilMeeting": {
            "id": 1,
            "date": "2116-11-29T22:00:00.000Z",
            "studentDeadline": "2116-11-24T22:00:00.000Z",
            "instructorDeadline": "2116-11-19T22:00:00.000Z",
            "createdAt": "2016-11-02T15:13:17.061Z",
            "updatedAt": "2016-11-02T15:13:17.061Z"
        }
    },
    {
        "id": 4,
        "authorFirstname": "4",
        "authorLastname": "Author",
        "authorEmail": "4@author.test",
        "title": "T",
        "urkund": "https://secure.urkund.com",
        "grade": "Laudatur",
        "graderEval": null,
        "CouncilMeetingId": 2,
        "StudyFieldId": 1,
        "UserId": 6,
        "regreq": null,
        "Graders": [
            {
                "id": 1,
                "name": "Arto Wikla",
                "title": "Prof",
                "GraderThesis": {
                    "createdAt": "2016-11-02T15:26:23.685Z",
                    "updatedAt": "2016-11-02T15:26:23.685Z",
                    "ThesisId": 4,
                    "GraderId": 1
                }
            },
            {
                "id": 2,
                "name": "Arto Vihavainen",
                "title": "Doc",
                "GraderThesis": {
                    "createdAt": "2016-11-02T15:26:23.684Z",
                    "updatedAt": "2016-11-02T15:26:23.684Z",
                    "ThesisId": 4,
                    "GraderId": 2
                }
            },
            {
                "id": 4,
                "name": "Grader4",
                "title": "Other",
                "GraderThesis": {
                    "createdAt": "2016-11-02T15:26:23.683Z",
                    "updatedAt": "2016-11-02T15:26:23.683Z",
                    "ThesisId": 4,
                    "GraderId": 4
                }
            }
        ],
        "ThesisProgress": {
            "id": 4,
            "ethesisDone": false,
            "graderEvalDone": true,
            "printDone": false,
            "studentNotificationSent": null,
            "createdAt": "2016-11-02T15:26:22.901Z",
            "updatedAt": "2016-11-02T15:26:24.357Z",
            "EthesisReminderId": 5,
            "GraderEvalReminderId": null,
            "PrintReminderId": null,
            "ThesisId": 4,
            "EthesisReminder": {
                "id": 5,
                "lastSent": "2016-11-02T15:26:24.262Z",
                "type": "EthesisReminder",
                "to": "4@author.test",
                "wasError": false,
                "createdAt": "2016-11-02T15:26:24.262Z",
                "updatedAt": "2016-11-02T15:26:24.262Z",
                "EmailDraftId": 6,
                "ThesisId": 4
            },
            "GraderEvalReminder": null,
            "PrintReminder": null
        },
        "StudyField": {
            "id": 1,
            "name": "Algorithmic Bioinformatics",
            "isActive": true,
            "createdAt": "2016-11-02T15:13:17.030Z",
            "updatedAt": "2016-11-02T15:13:17.030Z"
        },
        "User": {
            "id": 6,
            "email": "5@test.test",
            "firstname": "5",
            "lastname": "Instructor",
            "role": "instructor",
            "StudyFieldId": null
        },
        "CouncilMeeting": {
            "id": 2,
            "date": "2116-12-25T21:59:59.000Z",
            "studentDeadline": "2116-11-19T21:59:59.000Z",
            "instructorDeadline": "2116-11-17T21:59:59.000Z",
            "createdAt": "2016-11-02T15:19:14.050Z",
            "updatedAt": "2016-11-02T15:19:14.050Z"
        }
    }
]

responses.thesis.get.instructor = [
    {
        "id": 3,
        "authorFirstname": "3",
        "authorLastname": "Author",
        "authorEmail": "3@author.test",
        "title": "T",
        "urkund": "https://secure.urkund.com",
        "grade": "Lubenter Approbatur",
        "graderEval": null,
        "CouncilMeetingId": 1,
        "StudyFieldId": 4,
        "UserId": 5,
        "regreq": null,
        "Graders": [
            {
                "id": 2,
                "name": "Arto Vihavainen",
                "title": "Doc",
                "GraderThesis": {
                    "createdAt": "2016-11-02T15:24:43.762Z",
                    "updatedAt": "2016-11-02T15:24:43.762Z",
                    "ThesisId": 3,
                    "GraderId": 2
                }
            },
            {
                "id": 3,
                "name": "Grader3",
                "title": "AdjProf",
                "GraderThesis": {
                    "createdAt": "2016-11-02T15:24:43.761Z",
                    "updatedAt": "2016-11-02T15:24:43.761Z",
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
            "studentNotificationSent": null,
            "createdAt": "2016-11-02T15:24:42.633Z",
            "updatedAt": "2016-11-02T15:24:44.211Z",
            "EthesisReminderId": 3,
            "GraderEvalReminderId": 4,
            "PrintReminderId": null,
            "ThesisId": 3,
            "EthesisReminder": {
                "id": 3,
                "lastSent": "2016-11-02T15:24:44.011Z",
                "type": "EthesisReminder",
                "to": "3@author.test",
                "wasError": false,
                "createdAt": "2016-11-02T15:24:44.012Z",
                "updatedAt": "2016-11-02T15:24:44.012Z",
                "EmailDraftId": 6,
                "ThesisId": 3
            },
            "GraderEvalReminder": {
                "id": 4,
                "lastSent": "2016-11-02T15:24:44.017Z",
                "type": "GraderEvalReminder",
                "to": "3@test.test",
                "wasError": false,
                "createdAt": "2016-11-02T15:24:44.017Z",
                "updatedAt": "2016-11-02T15:24:44.017Z",
                "EmailDraftId": 7,
                "ThesisId": 3
            },
            "PrintReminder": null
        },
        "StudyField": {
            "id": 4,
            "name": "Software Systems",
            "isActive": true,
            "createdAt": "2016-11-02T15:13:17.033Z",
            "updatedAt": "2016-11-02T15:13:17.033Z"
        },
        "User": {
            "id": 5,
            "email": "4@test.test",
            "firstname": "4",
            "lastname": "Instructor",
            "role": "instructor",
            "StudyFieldId": null
        },
        "CouncilMeeting": {
            "id": 1,
            "date": "2116-11-29T22:00:00.000Z",
            "studentDeadline": "2116-11-24T22:00:00.000Z",
            "instructorDeadline": "2116-11-19T22:00:00.000Z",
            "createdAt": "2016-11-02T15:13:17.061Z",
            "updatedAt": "2016-11-02T15:13:17.061Z"
        }
    }
]
