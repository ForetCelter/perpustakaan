const express = require('express');

const router = express.Router()

const transactions = require('../controllers/transactions');
const { verifyToken, onlyAdmin } = require('../middleware/auth');

router.get('/', verifyToken, transactions.getAllTransactions);
router.post('/', verifyToken, transactions.borrowBook);
router.patch('/:id/return', verifyToken, transactions.returnBook);
router.delete('/:id', verifyToken, onlyAdmin, transactions.deleteTransaction);

module.exports = router;