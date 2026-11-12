const booksModels = require('../model/books');

const getAllBooks = async (req, res) => {
    try {
        const [dataBooks] = await booksModels.getAllBooks()
        
        res.json({
            message: 'GET SUCCESS',
            data: dataBooks
        })

    } catch (err) {
        res.status(500).json({
            message: 'GET FAILED',
            serverMessage: err.message
        })
    }
}

const createBooks = async (req, res) => {
    const { body } = req;
    try {
        await booksModels.createBooks(body)
        res.json({
            message: 'CREATE SUCCESS',
            data: body
        })
    } catch (err) {
        res.status(500).json({
            message: 'CREATE FAILED',
            serverMessage: err.message
        })
    }
}

const updateBooks = async (req, res) => {
    const { id } = req.params;

    const { body } = req;

    try {
        await booksModels.updateBooks(body, id)

        res.json({
            message: 'UPDATE SUCCESS',
            data: {
                id,
                ...body
            }
        })
    } catch (err) {
        res.status(500).json({
            message: 'UPDATE FAILED',
            serverMessage: err.message
        })
    }
}

const deleteBooks = async (req, res) => {
    const { id } = req.params;
    try {
        await booksModels.deleteBooks(id)

        res.json({
            message: 'DELETE SUCCESS',
            data: null
        })
    } catch (err) {
        res.status(500).json({
            message: 'DELETE FAILED',
            serverMessage: err.message
        })
    }
}

module.exports = {
    getAllBooks,
    createBooks,
    updateBooks,
    deleteBooks
}