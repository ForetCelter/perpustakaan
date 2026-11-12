const bcrypt = require('bcryptjs');

async function hashPassword() {
    const hash = await bcrypt.hash('siswa123', 10);
    console.log(hash);
}

hashPassword();