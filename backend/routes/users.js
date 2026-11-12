
const express = require('express');
const router = express.Router();

const usersController = require('../controllers/users');
const { verifyToken, onlyAdmin } = require('../middleware/auth');

router.get('/', verifyToken, onlyAdmin, usersController.getAllUsers);
router.post('/', verifyToken, onlyAdmin, usersController.createUsers);
router.patch('/:id', verifyToken, onlyAdmin, usersController.updateUsers);
router.delete('/:id', verifyToken, onlyAdmin, usersController.deleteUsers);

module.exports = router;
