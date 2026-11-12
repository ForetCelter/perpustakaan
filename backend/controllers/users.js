
const usersModels = require('../model/users');
const bcrypt = require('bcryptjs');

const getAllUsers = async (req, res) => {
    try {
        const [dataUser] = await usersModels.getAllUsers();

        // Jangan kirim password ke frontend
        const users = dataUser.map(({ password, ...user }) => user);

        res.json({
            message: 'GET SUCCESS',
            data: users
        });
    } catch (err) {
        res.status(500).json({
            message: 'GET FAILED',
            serverMessage: err.message
        });
    }
};

const createUsers = async (req, res) => {
    const { body } = req;

    try {
        const hashedPassword = await bcrypt.hash(body.password, 10);

        await usersModels.createUsers({
            ...body,
            password: hashedPassword
        });

        res.json({
            message: 'CREATE SUCCESS',
            data: {
                nama: body.nama,
                username: body.username,
                kelas: body.kelas,
                role: body.role
            }
        });
    } catch (err) {
        res.status(500).json({
            message: 'CREATE FAILED',
            serverMessage: err.message
        });
    }
};

const updateUsers = async (req, res) => {
    const { id } = req.params;
    const { body } = req;

    try {
        if (body.password) {
            body.password = await bcrypt.hash(body.password, 10);
        }

        await usersModels.updateUsers(body, id);

        res.json({
            message: 'UPDATE SUCCESS',
            data: { id, ...body, password: undefined }
        });
    } catch (err) {
        res.status(500).json({
            message: 'UPDATE FAILED',
            serverMessage: err.message
        });
    }
};

const deleteUsers = async (req, res) => {
    const { id } = req.params;

    try {
        await usersModels.deleteUsers(id);

        res.json({
            message: 'DELETE SUCCESS'
        });
    } catch (err) {
        res.status(500).json({
            message: 'DELETE FAILED',
            serverMessage: err.message
        });
    }
};

module.exports = {
    getAllUsers,
    createUsers,
    updateUsers,
    deleteUsers
};
