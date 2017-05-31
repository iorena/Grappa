const Sequelize = require("sequelize");

/**
 * Creates a new Sequelize database object depending of the current NODE_ENV.
 */
let seq;
if (process.env.NODE_ENV === "production") {
  seq = new Sequelize(process.env.DB_URL, {
    dialectOptions: {
      ssl: true,
    },
    logging: false,
  });
} else if (process.env.NODE_ENV === "testing") {
  seq = new Sequelize("grappa", "", "", {
    dialect: "sqlite",
    storage: "db/test-db.sqlite",
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
  sequelize: seq,
};
