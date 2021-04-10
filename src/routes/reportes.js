const express = require('express');
const moment = require('moment');
const router = express.Router();

const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');

router.get('/', isLoggedIn, async (req, res) => {
    const user = req.user.id;
    const dataComprobanteMaster = await pool.query('SELECT * FROM comprobantesmaster WHERE user_id = ? ORDER BY id DESC', [user]);
    //const generarTablaInventario = await pool.query('SELECT * FROM existenciademercaderia WHERE user_id = ?', [user]);
    res.render('reportes/tabla', {dataComprobanteMaster: dataComprobanteMaster});
});

router.get('/reporteinventario', async (req, res) => {
    const user = req.user.id;
    let numeroDeComprobante;
    let tipoDeReporte = "Inventario";
    const ordernar = await pool.query('SELECT numeroComprobante FROM comprobantesmaster ORDER BY id DESC LIMIT 1');
    if (!ordernar[0]) {
        numeroDeComprobante = 1;
    } else if (ordernar[0].numeroComprobante) {
        numeroDeComprobante = ordernar[0].numeroComprobante + 1;
    }
    const seleccionarArt = await pool.query('SELECT producto, categoria, precioCompra, precioVenta, cantidad FROM stock WHERE cantidad > 0 AND user_id = ?', [user]);
    seleccionarArt.forEach(async element => {
        await pool.query('INSERT INTO existenciademercaderia(producto, categoria, precioCosto, precioVenta, cantidad, user_id, numeroComprobante, tipoDeReporte) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', 
        [element.producto, element.categoria, element.precioCompra, element.precioVenta, element.cantidad, user, numeroDeComprobante, tipoDeReporte]);
    });
    await pool.query('INSERT INTO comprobantesmaster(numeroComprobante, tipoDeReporte, user_id) VALUES (?, ?, ?)', [numeroDeComprobante, tipoDeReporte, user]);
    res.redirect('/reportes');
});

router.get('/reportecaja', async (req, res) => {
    const user = req.user.id;
    let numeroDeComprobante;
    let tipoDeReporte = "Caja";
    const ordernar = await pool.query('SELECT numeroComprobante FROM comprobantesmaster ORDER BY id DESC LIMIT 1');
    if (!ordernar[0]) {
        numeroDeComprobante = 1;
    } else if (ordernar[0].numeroComprobante) {
        numeroDeComprobante = ordernar[0].numeroComprobante + 1;
    }
    const dia = getDia();
    function getDia() {
        moment.locale('es');
        return moment().format("YYYY-MM-DD");
        //return moment().format("dddd, MMMM Do YYYY");
    };
    const match = await pool.query('SELECT * FROM ventasstock WHERE user_id = ? AND DATE(created_at) = ?', [user, dia]);
    //console.log(match);
    match.forEach(async obj => {
        await pool.query('INSERT INTO comprobantecaja(numeroComprobante, producto, descripcion, cliente, cantidadVendidos, gananciaBruta, gananciaNeta, montoVenta, montoVentaNeto, metodo, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [numeroDeComprobante, obj.producto, obj.descripcion, obj.cliente, obj.cantidadVendidos, obj.gananciaBruta, obj.gananciaNeta, obj.montoVenta, obj.montoVentaNeto, obj.metodo, user]);
    });
    await pool.query('INSERT INTO comprobantesmaster(numeroComprobante, tipoDeReporte, user_id) VALUES (?, ?, ?)', [numeroDeComprobante, tipoDeReporte, user]);
    res.redirect('/reportes');
});

router.get('/detalles/:numeroComprobante', async (req, res) => {
    const { numeroComprobante } = req.params;
    const match = await pool.query('SELECT * FROM comprobantesmaster WHERE numeroComprobante = ?', [numeroComprobante]);
    const reporteMercaderia = await pool.query('SELECT * FROM existenciademercaderia WHERE numeroComprobante = ?', [numeroComprobante]);
    const reporteCaja = await pool.query('SELECT * FROM comprobantecaja WHERE numeroComprobante = ?', [numeroComprobante]);
    res.render('reportes/detalles', {match: match[0], reporteMercaderia: reporteMercaderia, reporteCaja: reporteCaja, numeroComprobante: numeroComprobante});
});

module.exports = router;