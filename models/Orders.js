const db = require('../database/db');

module.exports = db.defineModel('orders', {
    orderNum: {
        type: db.STRING(100),
        unique: true
    },
    uid: db.STRING(100),
    credits: db.BIGINT(20),
    appKey: db.STRING(40),
    description: db.STRING(100),
    orderNum: db.STRING(100),
    type: db.STRING(40),
    params: db.STRING(100),
    finished: db.BOOLEAN
});