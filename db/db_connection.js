"use strict";

const Sequelize = require("sequelize");

const dbUrl = process.env.DATABASE_URL;

let seq;
if (process.env.NODE_ENV === "production") {
  seq = new Sequelize(dbUrl, {
    dialectOptions: {
      ssl: true,
    }
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
