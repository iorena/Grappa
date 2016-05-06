"use strict";

const Sequelize = require("sequelize");

const dbUrl = process.env.DATABASE_URL || "postgres://keuoblxbkbspkf:7DOjZx2eHir2SYgemNZo_3EbxI@ec2-54-225-151-64.compute-1.amazonaws.com:5432/d2ts0v8erk5vak";
let seq;
if (process.env.NODE_ENV === "production") {
  seq = new Sequelize(dbUrl, {
    dialectOptions: {
      ssl: true,
    },
  });
} else {
  seq = new Sequelize("grappa", "", "", {
    dialect: "sqlite",
    storage: "db/dev-db.sqlite",
  });
}

module.exports = {
  sequalize: seq,
};
