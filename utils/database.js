const mysql = require("mysql2")
const chalk = require("chalk");
const config = require("./config");
const log = require("./log")

const dbCon = mysql.createConnection(config.database);

dbCon.connect((err) => {
    if (err) {
      log(`Database: ${err}`, "error")
      process.exit(1);
    }
    log(`Database: Connected`, "success")
  });

module.exports = dbCon;