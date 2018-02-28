const db = require('../database/db');

module.exports = db.defineModel('users', {
    uid: {
        type: db.STRING(100),
        unique: true
    },
    credits: db.BIGINT(20),
    nickName: db.STRING(100),
    gender: db.STRING(20)
});