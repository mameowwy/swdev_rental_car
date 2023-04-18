const mysql = require('mysql');

var connection = mysql.createPool({
    // host: 'localhost',
    socketPath: '/tmp/mysql.sock',
    user: 'root',
    password: '12345678',
    database: 'vacCenter'
});

module.exports = connection;