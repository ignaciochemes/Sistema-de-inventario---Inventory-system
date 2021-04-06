const express = require('express');
const router = express.Router();

const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');

router.get('/', isLoggedIn, async (req, res) => {
    const user = req.user.id;
    const dataComprobanteMaster = await pool.query('SELECT * FROM comprobantesmaster WHERE user_id = ?', [user]);
    //const generarTablaInventario = await pool.query('SELECT * FROM existenciademercaderia WHERE user_id = ?', [user]);
    res.render('reportes/tabla', {dataComprobanteMaster: dataComprobanteMaster});
});

router.get('/reporteinventario', async (req, res) => {
    const user = req.user.id;
    let numeroDeComprobante;
    let tipoDeReporte = "Inventario";
    const ordernar = await pool.query('SELECT numeroComprobante FROM existenciademercaderia ORDER BY id DESC LIMIT 1');
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

router.get('/detalles/:numeroComprobante', async (req, res) => {
    const { numeroComprobante } = req.params;
    const reporte = await pool.query('SELECT * FROM existenciademercaderia WHERE numeroComprobante = ?', [numeroComprobante])
    res.render('reportes/detalles', {reporte: reporte, numeroComprobante: numeroComprobante});
});

module.exports = router;