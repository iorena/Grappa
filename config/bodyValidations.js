/**
 * Sanitizations and validations defined as JSON-schemas.
 *
 * Used by the validateBody.js middleware to transform and validte the requests'
 * JSON-bodies. Extremely useful to define here than validate manually inside controllers (brr...).
 * Uses the schemas for schema-inspector https://www.npmjs.com/package/schema-inspector
 */
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
        date: {
          type: "date",
          exec(schema, post) {
            post = new Date(post);
            post.setHours(23, 59, 59, 0);
            return post;
          }
        },
        studentDeadline: {
          type: "date",
          exec(schema, post) {
            post = new Date(post);
            post.setHours(23, 59, 59, 0);
            return post;
          }
        },
        instructorDeadline: {
          type: "date",
          exec(schema, post) {
            post = new Date(post);
            post.setHours(23, 59, 59, 0);
            return post;
          }
        },
      }
    }
  },
  thesis: {
    doc: {
      type: "object",
      properties: {
        id: { type: "number" },
        type: { type: "string" }
      }
    },
    pdf: {
      type: "object",
      properties: {
        thesisIds: { type: "array", },
        CouncilMeetingId: { type: "number" }
      }
    },
    move: {
      type: "object",
      properties: {
        CouncilMeetingId: { type: "number" },
      }
    },
  }
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
      exec(schema, post) {
        if (!(post.date instanceof Date)) {
          this.report("Date wasn't a Date.");
        } else if (!(post.instructorDeadline instanceof Date) || !(post.studentDeadline instanceof Date)) {
          this.report("Deadline wasn't a Date.");
        } else if (post.date < post.instructorDeadline || post.date < post.studentDeadline) {
          this.report("Deadline was after date.");
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
        files: {
          type: "array",
          minLength: 1,
          error: "No file sent.",
          items: {
            type: "object",
            file: { type: "any", error: "File didn't contain any data." },
            ext: {
              type: "string",
              pattern: /^pdf$/,
              error: "File extension wasn't .pdf"
            },
          }
        },
      }
    },
    save: {
      type: "object",
      properties: {
        files: {
          type: "array",
          minLength: 1,
          error: "No file sent.",
          items: {
            type: "object",
            file: { type: "any", error: "File didn't contain any data." },
            ext: {
              type: "string",
              pattern: /^pdf$/,
              error: "File extension wasn't .pdf"
            },
            filetype: {
              type: "string",
              pattern: /^GraderReviewFile$/,
              error: "Filetype wasn't GraderReviewFile."
            },
          }
        },
        json: {
          type: "object",
          error: "Json field must be an object.",
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
      type: "object",
      properties: {
        thesisIds: { type: "array", minLength: 1, error: "You must select at least 1 thesis." },
        CouncilMeetingId: { type: "number", optional: true } // if no meeting given -> no cover generated
      }
    },
    doc: {
      type: "object",
      properties: {
        id: { type: "number" },
        type: {
          type: "string",
          pattern: /^(review|abstract)$/,
          error: "Type wasn't review or abstract",
        }
      }
    },
    move: {
      type: "object",
      properties: {
        thesisIds: {
          type: "array",
          minLength: 1,
          error: "No theses received.",
        },
        CouncilMeetingId: { type: "number" },
      }
    },
    update: {
      type: "object",
      properties: {
        files: {
          type: "array",
          error: "No file sent.",
          items: {
            type: "object",
            properties: {
              ext: {
                type: "string",
                pattern: /^pdf$/,
                error: "File extension wasn't .pdf"
              },
              filetype: {
                type: "string",
                pattern: /^(GraderReviewFile|AbstractFile)$/,
                error: "Filetype wasn't GraderReviewFile or AbstractFile."
              },
            }
          }
        }
      }
    }
  },
  email: {
    remind: {
      type: "object",
      properties: {
        thesisId: { type: "number", error: "No thesisId in request body." },
        reminderType: {
          type: "string",
          pattern: /^(EthesisReminder|GraderEvalReminder|PrintReminder|StudentRegistrationNotification)$/,
          error: "ReminderType wasn't EthesisReminder, GraderEvalReminder, PrintReminder or StudentRegistrationNotification."
        },
      },
    }
  }
};

module.exports = {
  sanitizations,
  validations,
}
