#!/usr/bin/env node

"use strict";

const db_methods = require("../db/methods");

/*
 * Logic for dynamic npm script "db" and "db:prod"
 *
 * Parses the command as JSON from npm_config_argv.original
 * which stores them in a list eg. ["npm", "run", "db", "stuff"]
 * and calls database-methods as defined in switch-cases.
 * "db"-script does the methods to the local Sqlite-database,
 * "db:prod" does them to Heroku's Postgres-database
 */
const commands = JSON.parse(process.env.npm_config_argv).original;
// console.log(commands);
if (commands.length > 2) {
  const command = commands[2];
  // console.log(command);
  switch(command) {
    case "create":
      db_methods.createTables();
      break;
    case "drop":
      db_methods.dropTables();
      break;
    case "add":
      db_methods.addTestData();
      break;
    case "destroy":
      db_methods.destroyTables();
      break;
    case "reset":
      db_methods.resetTestData();
      break;
    case "init":
      db_methods.dropAndCreateTables();
      break;
    case "dump":
      db_methods.dump()
      .then(data => {
        console.log(data);
      })
      break;
    default:
      console.log(`Unknown command ${command}`);
      break;
  }
}
