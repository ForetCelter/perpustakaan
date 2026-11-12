
const dbPool = require('../config/db');

const getAllTransactions = (userId) => {
    let SQLQuery = `
        SELECT
            transactions.id,
            users.nama,
            books.judul,
            transactions.tanggal_pinjam,
            transactions.tanggal_kembali,
            transactions.status
        FROM transactions
        JOIN users ON transactions.user_id = users.id
        JOIN books ON transactions.book_id = books.id
    `;

    if (userId) {
        SQLQuery += ` WHERE transactions.user_id = ?`;
        return dbPool.execute(SQLQuery, [userId]);
    }

    return dbPool.execute(SQLQuery);
};

const borrowBook = (bookId) => {
    const SQLQuery = `
        UPDATE books
        SET stok = stok - 1
        WHERE id = ? AND stok > 0
    `;
    return dbPool.execute(SQLQuery, [bookId]);
};

const createTransactions = (userId, bookId) => {
    const SQLQuery = `
        INSERT INTO transactions (user_id, book_id, tanggal_pinjam)
        VALUES (?, ?, CURDATE())
    `;
    return dbPool.execute(SQLQuery, [userId, bookId]);
};

const getActiveTransaction = (id) => {
    const SQLQuery = `
        SELECT book_id, user_id
        FROM transactions
        WHERE id = ? AND status = 'dipinjam'
    `;
    return dbPool.execute(SQLQuery, [id]);
};

const returnTransaction = (id) => {
    const SQLQuery = `
        UPDATE transactions
        SET status = 'dikembalikan',
            tanggal_kembali = CURDATE()
        WHERE id = ?
    `;
    return dbPool.execute(SQLQuery, [id]);
};

const addStocks = (bookId) => {
    const SQLQuery = `
        UPDATE books
        SET stok = stok + 1
        WHERE id = ?
    `;
    return dbPool.execute(SQLQuery, [bookId]);
};

const deleteTransaction = (id) => {
    const SQLQuery = `
        DELETE FROM transactions
        WHERE id = ? AND status = 'dikembalikan'
    `;
    return dbPool.execute(SQLQuery, [id]);
};

module.exports = {
    getAllTransactions,
    borrowBook,
    createTransactions,
    getActiveTransaction,
    returnTransaction,
    addStocks,
    deleteTransaction
};
