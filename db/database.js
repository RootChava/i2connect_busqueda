const util = require('util');
const mysql = require('mysql');
const { twoDigits } = require('../utilidad');
const databaseConfig = require('../config').database;

const pool = mysql.createPool({
    connectionLimit: databaseConfig.connectionLimit,
    host: databaseConfig.host,
    user: databaseConfig.user,
    password: databaseConfig.password,
    database: databaseConfig.database
});

pool.getConnection((err, connection) => {
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('Conexión se perdio con la base de datos.');
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('Demasiadas conexiones a la base de datos.');
        }
        if (err.code === 'ECONNREFUSED') {
            console.error('Conexión a la base de datos rechazada.');
        }
    }
    if (connection) connection.release();
    return;
});

Date.prototype.toMysqlFormat = function () {
    return (
        this.getUTCFullYear() +
        "-" +
        twoDigits(1 + this.getUTCMonth()) +
        "-" +
        twoDigits(this.getUTCDate()) +
        " " +
        twoDigits(this.getUTCHours()) +
        ":" +
        twoDigits(this.getUTCMinutes()) +
        ":" +
        twoDigits(this.getUTCSeconds())
    );
};

Date.prototype.toMysqlTimeFormat = function () {
    return (
        twoDigits(this.getUTCHours()) +
        ":" +
        twoDigits(this.getUTCMinutes()) +
        ":" +
        twoDigits(this.getUTCSeconds())
    );
};

pool.query = util.promisify(pool.query);

const search_query = (query, ...args) => {
    return new Promise((resolve, reject) => {
        pool.query(query, args, (err, rows) => {
            if (err) {
                console.log("ERROR AL REALIZAR LA PETICIÓN A LA BASE DE DATOS");
                return reject(err);
            } else {
                return resolve(rows);
            }
        });
    });
}

module.exports = { search_query };