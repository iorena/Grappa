#!/usr/bin/env node

"use strict";

if (!process.env.NODE_ENV) {
  require("dotenv").config();
}
const db_methods = require("../db/methods");

/**
 * Logic for dynamic npm script "db"
 *
 * Parses the command as JSON from npm_config_argv.original
 * which stores them in a list eg. ["run", "db", "stuff"]
 * and calls database-methods as defined in switch-cases.
 */
const commands = JSON.parse(process.env.npm_config_argv).original;
if (commands.length > 2) {
  const command = commands[2];
  switch (command) {
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
    case "reset:lot":
      db_methods.resetLotTestData();
      break;
    case "init":
      db_methods.dropAndCreateTables();
      break;
    case "dump":
      db_methods.dump()
      .then(data => {
        console.log(data);
      });
      break;
    default:
      console.log(`Unknown command ${command}`);
      break;
  }
}
