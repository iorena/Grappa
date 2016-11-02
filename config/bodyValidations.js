const sanitizations = {
  user: {
    login: {
      type: "object",
      properties: {
        email: { type: "string", rules: ["trim", "lower"] }
      }
    },
    save: {
      type: "object",
      properties: {
        firstname: { type: "string", rules: ["trim", "title"] },
        lastname: { type: "string", rules: ["trim", "title"] },
        email: { type: "string", rules: ["trim", "lower"] }
      }
    },
  },
  councilmeeting: {
    save: {
      type: "object",
      properties: {
        date: { type: "date" },
        studentDeadlineDays: { type: "number" },
        instructorDeadlineDays: { type: "number" },
      }
    },
    update: {
      type: "object",
      properties: {
        date: { type: "date" },
        studentDeadline: { type: "date" },
        instructorDeadline: { type: "date" },
      }
    }
  },
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
    resetPassword: {
      type: "object",
      properties: {
        email: { type: "string", pattern: "email" },
      }
    },
    sendNewPassword: {
      type: "object",
      properties: {
        token: { type: "string", minLength: 1 },
      }
    }
  },
  councilmeeting: {
    save: {
      type: "object",
      properties: {
        date: { type: "date" },
        studentDeadlineDays: {
          type: "number",
          gt: 0,
          lt: 30,
          error: "Student deadline days must be more than 0 and less than 30."
        },
        instructorDeadlineDays: {
          type: "number",
          gt: 0,
          lt: 30,
          error: "Instructor deadline days must be more than 0 and less than 30."
        },
      }
    },
    update: {
      type: "object",
      exec: function (schema, post) {
        console.log(post)
        if (!post.date instanceof Date) {
          this.report("Date wasn't a Date.");
        } else if (!post.instructorDeadline instanceof Date || !post.studentDeadline instanceof Date) {
          this.report("Deadline wasn't a Date.");
        } else if (post.date < post.instructorDeadline || post.date < post.studentDeadline) {
          this.report("Deadline was before date.");
        } else {
          return post;
        }
        return "";
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
        name: { type: "string", minLength: 2 },
      }
    },
  },
  thesis: {
    ethesis: {
      type: "object",
      properties: {
        file: { type: "any", error: "No file sent." },
        fileExt: {
          type: "string",
          pattern: /^pdf/,
          error: "File extension wasn't .pdf"
        },
      }
    },
    save: {
      type: "object",
      properties: {
        file: { type: "any", error: "No file sent." },
        fileExt: {
          type: "string",
          pattern: /^pdf/,
          error: "File extension wasn't .pdf"
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
  },
  email: {
    remind: {
      type: "object",
      properties: {
        thesisId: { type: "number", error: "No thesisId in request body." },
        reminderType: {
          type: "string",
          pattern: /^(EthesisReminder|GraderEvalReminder|PrintReminder)/,
          error: "ReminderType wasn't EthesisReminder or GraderEvalReminder or PrintReminder."
        },
      },
      exec: function (schema, post) {
        console.log(post)
      }
    }
  }
};

module.exports = {
  sanitizations,
  validations,
}
