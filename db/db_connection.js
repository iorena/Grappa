"use strict";

const Sequelize = require("sequelize");

const dbUrl = process.env.DB_URL;
let seq;
if (process.env.NODE_ENV === "production") {
  seq = new Sequelize(dbUrl, {
    dialectOptions: {
      ssl: true,
    },
    logging: false,
  });
} else {
  seq = new Sequelize("grappa", "", "", {
    dialect: "sqlite",
    storage: "db/dev-db.sqlite",
    logging: false,
  });
}

module.exports = {
  sequalize: seq,
};
