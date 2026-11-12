const authModel = require('../model/auth');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
    const { username, password } = req.body || {};

    if (!username || !password) {
        return res.status(400).json({ message: 'Username dan password wajib diisi' })
    }

    try {
        const [dataUser] = await authModel.findUser(username);

        if (dataUser.length === 0) {
            return res.status(401).json({ message: 'Username atau password salah' })
        }

        const cocok = await bcrypt.compare(password, dataUser[0].password);

        if (!cocok) {
            return res.status(401).json({ message: 'Username atau password salah' })
        }

        const { id, nama, role } = dataUser[0];
        const token = jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '8h' });

        res.json({ message: 'Login berhasil', data: { id, nama, role, token } })
    } catch (err) {
        res.status(500).json({ message: 'Login Gagal', serverMessage: err.message })
    }
}

module.exports = { 
    login 
}