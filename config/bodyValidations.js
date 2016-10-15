const sanitizations = {
  // user: {
  //   login: {
  //     type: "object",
  //     strict: true,
  //     properties: {
  //       // firstname: { type: "string", rules: ["trim", "title"] },
  //       // lastname: { type: "string", rules: ["trim", "title"] },
  //       // jobs: {
  //       //   type: "array",
  //       //   splitWith: ",",
  //       //   items: { type: "string", rules: ["trim", "title"] }
  //       // },
  //       email: { type: "string", rules: ["trim", "lower"] },
  //       password: { type: "string" }
  //     }
  //   },
  //   save: {
  //     strict: true,
  //     type: "object",
  //     properties: {
  //       firstname: { type: "string", },
  //       lastname: { type: "string", },
  //       email: { type: "string", },
  //       password: { type: "string", },
  //     }
  //   }
  // },
};

const validations = {
  user: {
    login: {
      type: "object",
      properties: {
        email: { type: "string", pattern: "email" },
        password: { type: "string", minLength: 1 },
      }
    },
    save: {
      type: "object",
      properties: {
        firstname: { type: "string", minLength: 1 },
        lastname: { type: "string", minLength: 1 },
        email: { type: "string", pattern: "email" },
        password: { type: "string", minLength: 8 },
      }
    },
  },
  councilmeeting: {
    save: {
      type: "object",
      properties: {
        date: { type: "string", minLength: 1 },
      }
    },
    update: {
      type: "object",
      properties: {
        date: { type: "date" },
      }
    }
  },
  grader: {
    save: {
      type: "object",
      properties: {
        name: { type: "string", minLength: 1 },
        title: { type: "string", minLength: 1 },
      }
    },
  },
  studyfield: {
    save: {
      type: "object",
      properties: {
        name: { type: "string", minLength: 1 },
      }
    },
  },
  thesis: {
    ethesis: {
      type: "object",
      properties: {
        token: { type: "string", minLength: 1 },
        link: { type: "string", minLength: 1 },
      }
    },
    save: {
      type: "object",
      properties: {
        file: { type: "any", error: "No file sent." },
        fileExt: {
          type: "string",
          minLength: 1,
          error: "File extension wasn't PDF."
        },
        json: {
          type: "object",
          properties: {
            authorFirstname: { type: "string", minLength: 1 },
            authorLastname: { type: "string", minLength: 1 },
            authorEmail: { type: "string", minLength: 1 },
            title: { type: "string", minLength: 1 },
            urkund: { type: "string", minLength: 1 },
            grade: { type: "string", minLength: 1 },
            Graders: { type: "array", minLength: 2 },
            StudyFieldId: { type: "string", minLength: 1 },
            CouncilMeetingId: { type: "string", minLength: 1 },
          }
        }
      }
    },
    pdf: {
      type: "array",
      minLength: 1,
      properties: {
      }
    },
  }
};

module.exports = {
  sanitizations,
  validations,
}
