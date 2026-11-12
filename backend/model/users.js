const dbPool = require('../config/db');

const getAllUsers = () => {
    const SQLQuery = `  SELECT * FROM users`

    return dbPool.execute(SQLQuery);
}

const createUsers = (body) => {
    const SQLQuery = `  INSERT INTO users (nama, username, password, kelas, role)
                        VALUES (?, ?, ?, ?, ?)`

    return dbPool.execute(SQLQuery, [body.nama, body.username, body.password, body.kelas, body.role])
}

const updateUsers = (body, id) => {
    const SQLQuery = `  UPDATE users SET nama=?, username=?, password=?, kelas=?, role=?
                        WHERE id=?`
    
    return dbPool.execute(SQLQuery, [body.nama, body.username, body.password, body.kelas, body.role, id])
}

const deleteUsers = (id) => {
    const SQLQuery = `  DELETE FROM users WHERE id=?`

    return dbPool.execute(SQLQuery, [id])
}

module.exports = {
    getAllUsers,
    createUsers,
    updateUsers,
    deleteUsers
}