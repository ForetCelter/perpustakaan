const mysql = require('mysql2');

const dbPool = mysql.createPool({
    host: process.env.DB,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
})

module.exports = dbPool.promise();