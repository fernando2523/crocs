"use strict";
const mysql = require("mysql2/promise");

const dbPool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  port: 3306,
  database: process.env.DB_NAME,
});

module.exports = dbPool;
