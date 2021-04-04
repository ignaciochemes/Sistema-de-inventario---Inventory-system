const express = require('express');
const router = express.Router();

const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');


router.get('/', isLoggedIn, async (req, res) => {
    const venta = await pool.query('SELECT * FROM ventasstock WHERE user_id = ?', [req.user.id]);
    res.render('ventas/tabla', {ventas: venta}); 
});

router.get('/add', isLoggedIn, async (req, res) => {
    const producto = await pool.query('SELECT id, producto FROM stock WHERE user_id = ?', [req.user.id]);
    res.render('ventas/add', {productos: producto});
});

router.post('/add', isLoggedIn, async (req, res) => {
    const { producto, descripcion, cliente, cantidadVendidos, montoVenta } = req.body;
    const nuevoProducto = {
        producto,
        descripcion,
        cliente,
        cantidadVendidos,
        montoVenta,
        user_id: req.user.id
    };

    await pool.query('INSERT INTO ventasstock set ?', [nuevoProducto]);
    req.flash('success', 'Venta masiva guardada correctamente!');
    res.redirect('/ventas');
});

router.get('/delete/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    await pool.query('DELETE FROM ventasstock WHERE id = ?', [id]);
    req.flash('success', 'Venta removida satisfactoriamente');
    res.redirect('/ventas');
});

router.get('/detalles/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const detalles = await pool.query('SELECT * FROM ventasstock WHERE id = ?', [id]);
    res.render('ventas/detalles', {detalles: detalles[0]});
});

router.get('/edit/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const venta = await pool.query('SELECT * FROM ventasstock WHERE id = ?', [id]);
    res.render('ventas/edit', {ventas: venta[0]});
});

router.post('/edit/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const { producto, descripcion, cliente, cantidadVendidos, gananciaBruta, gananciaNeta, montoVenta } = req.body;
    const nuevoProducto = {
        producto,
        descripcion,
        cliente,
        cantidadVendidos,
        gananciaBruta,
        gananciaNeta,
        montoVenta,
        user_id: req.user.id
    };
    await pool.query('UPDATE ventasstock set ? WHERE id = ?', [nuevoProducto, id]);
    req.flash('success', 'Venta editada satisfactoriamente');
    res.redirect('/ventas');
});

module.exports = router;