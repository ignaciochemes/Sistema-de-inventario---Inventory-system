const mysql = require('mysql');
const { promisify } = require('util');
const { database } = require('./keys');

const pool = mysql.createPool(database);

pool.getConnection((err, conexion) => {
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('LA CONEXION CON LA BASE DE DATOS FUE CERRADA');
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('LA CONEXION CON LA BASE DE DATOS TIENE MUCHAS CONEXIONES');
        }
        if (err.code === 'ECONNREFUSED') {
            console.error('LA CONEXION CON LA BASE DE DATOS FUE RECHAZADA')
        }
    }
    if (conexion) conexion.release();
    console.log('LA BASE DE DATOS ESTA CONECTADA!');
    return;
})

//Con esta linea de codigo podemos usar promesas en MYSQL
pool.query = promisify(pool.query);

module.exports = pool;