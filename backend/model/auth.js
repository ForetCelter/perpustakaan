const dbPool = require('../config/db');

const findUser = (username) => {
    const SQLQuery = `SELECT id, nama, username, password, role FROM users WHERE username = ?`
    return dbPool.execute(SQLQuery, [username])
}

module.exports = { 
    findUser 
}