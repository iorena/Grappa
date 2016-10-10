const sanitizations = {
  user: {
    login: {
      type: "object",
      strict: true,
      properties: {
        // firstname: { type: "string", rules: ["trim", "title"] },
        // lastname: { type: "string", rules: ["trim", "title"] },
        // jobs: {
        //   type: "array",
        //   splitWith: ",",
        //   items: { type: "string", rules: ["trim", "title"] }
        // },
        email: { type: "string", rules: ["trim", "lower"] },
        password: { type: "string" }
      }
    },
    save: {
      strict: true,
      type: "object",
      properties: {
        firstname: { type: "string", },
        lastname: { type: "string", },
        email: { type: "string", },
        password: { type: "string", },
      }
    }
  },
  item: {
    save: {
      type: "object",
      strict: true,
      properties: {
        content: { type: "string", minLength: 1 }
      }
    }
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
  },
  item: {
    save: {
      type: "object",
      properties: {
        content: { type: "string", minLength: 1 },
      }
    }
  }
};

module.exports = {
  sanitizations,
  validations,
}
