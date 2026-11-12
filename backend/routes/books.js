
const express = require('express');
const router = express.Router();

const booksControllers = require('../controllers/books');
const { verifyToken, onlyAdmin } = require('../middleware/auth');

router.get('/', verifyToken, booksControllers.getAllBooks);
router.post('/', verifyToken, onlyAdmin, booksControllers.createBooks);
router.patch('/:id', verifyToken, onlyAdmin, booksControllers.updateBooks);
router.delete('/:id', verifyToken, onlyAdmin, booksControllers.deleteBooks);

module.exports = router;
