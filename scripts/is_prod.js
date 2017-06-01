/**
 * Used by package.json's npm scripts to test the NODE_ENV!==production condition.
 * Cuz it's the only way to do it in cross-platform way.
 */

if (!process.env.NODE_ENV) {
  require("dotenv").config();
}
/**
 * If environment is not production throw an error.
 */
if (process.env.NODE_ENV !== "production") {
  process.exit(1);
}
