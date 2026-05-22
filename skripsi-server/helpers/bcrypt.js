const bcrypt = require('bcryptjs');

function hashPass (password) {
    let salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
};

function comparePass (password, hashPassword) {
    return bcrypt.compareSync(password, hashPassword);
};

module.exports = { hashPass, comparePass }