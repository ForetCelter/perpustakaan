require('dotenv').config();

const PORT = process.env.PORT

const express = require('express');
const cors = require('cors')

const usersRouter = require('./routes/users');
const transactionsRouter = require('./routes/transactions');
const booksRouter = require('./routes/books');
const authRouter = require('./routes/auth');

const app = express();

app.use(cors())
app.use(express.json());

app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.use('/books', booksRouter);
app.use('/transactions', transactionsRouter);

app.use('/', (req, res) => {
    console.log('Halo ini backend')
});

app.listen(PORT, () => {
    console.log(`Server berjalan di port ${PORT}`)
});