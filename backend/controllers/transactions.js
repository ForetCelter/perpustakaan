const transactionsModel = require('../model/transactions');

const getAllTransactions = async (req, res) => {
    const userId = req.user.role === 'admin' ? req.query.user_id : req.user.id;

    try {
        const [data] = await transactionsModel.getAllTransactions(userId);
        res.json({ message: 'GET Transactions SUCCESS', data })
    } catch (err) {
        res.status(500).json({ message: 'FAILED To GET Transactions', serverMessage: err.message })
    }
}

const borrowBook = async (req, res) => {
    try {
        const { id_books } = req.body || {};
        const id_user = req.user.role === 'admin' ? req.body.id_user : req.user.id;

        if (!id_user || !id_books) {
            return res.status(400).json({ message: 'Id user dan id books wajib diisi' })
        }

        const [result] = await transactionsModel.borrowBook(id_books);

        if (result.affectedRows === 0) {
            return res.status(400).json({ message: 'Stok buku habis' })
        }

        await transactionsModel.createTransactions(id_user, id_books);

        res.status(201).json({ message: 'Peminjaman Buku Sukses' })
    } catch (err) {
        res.status(500).json({ message: 'Peminjaman Buku Gagal', serverMessage: err.message })
    }
}

const returnBook = async (req, res) => {
    const { id } = req.params;

    try {
        const [dataAktif] = await transactionsModel.getActiveTransaction(id);

        if (dataAktif.length === 0) {
            return res.status(404).json({ message: 'Transaksi tidak ditemukan atau sudah dikembalikan' })
        }

        if (req.user.role !== 'admin' && dataAktif[0].user_id !== req.user.id) {
            return res.status(403).json({ message: 'Ini bukan transaksi kamu' })
        }

        await transactionsModel.returnTransaction(id);
        await transactionsModel.addStocks(dataAktif[0].book_id);

        res.json({ message: 'Pengembalian berhasil' })
    } catch (err) {
        res.status(500).json({ message: 'Pengembalian Gagal', serverMessage: err.message })
    }
}

const deleteTransaction = async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await transactionsModel.deleteTransaction(id);

        if (result.affectedRows === 0) {
            return res.status(400).json({ message: 'Hanya transaksi yang sudah dikembalikan yang bisa dihapus' })
        }

        res.json({ message: 'DELETE Transaction SUCCESS' })
    } catch (err) {
        res.status(500).json({ message: 'FAILED To DELETE Transaction', serverMessage: err.message })
    }
}

module.exports = { 
    getAllTransactions, 
    borrowBook, 
    returnBook, 
    deleteTransaction 
}