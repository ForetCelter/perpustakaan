const dbPool = require('../config/db');

const getAllBooks = () => {
    const SQLQuery = `  SELECT * FROM books`

    return dbPool.execute(SQLQuery);
}

const createBooks = (body) => {
    const SQLQuery = `  INSERT INTO books (nama, username, password, kelas, role)
                        VALUES (?, ?, ?, ?, ?)`

    return dbPool.execute(SQLQuery, [body.nama, body.username, body.password, body.kelas, body.role])
}

const updateBooks = (body, id) => {
    const SQLQuery = `  UPDATE books SET nama=?, username=?, password=?, kelas=?, role=?
                        WHERE id=?`
    
    return dbPool.execute(SQLQuery, [body.nama, body.username, body.password, body.kelas, body.role, id])
}

const deleteBooks = (id) => {
    const SQLQuery = `  DELETE FROM books WHERE id=?`

    return dbPool.execute(SQLQuery, [id])
}

module.exports = {
    getAllBooks,
    createBooks,
    updateBooks,
    deleteBooks
}