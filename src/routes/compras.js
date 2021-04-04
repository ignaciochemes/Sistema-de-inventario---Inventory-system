const express = require('express');
const router = express.Router();

const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');


router.get('/', isLoggedIn, async (req, res) => {
    const compra = await pool.query('SELECT * FROM comprastock WHERE user_id = ?', [req.user.id]);
    const proveedor = await pool.query('SELECT * FROM proveedores WHERE user_id = ?', [req.user.id]);
    res.render('compras/tabla', {compras: compra, proveedores: proveedor});
});

router.get('/add', isLoggedIn, async (req, res) => {
    const proveedores = await pool.query('SELECT * FROM proveedores WHERE user_id = ?', [req.user.id]);
    res.render('compras/add', {proveedores: proveedores});
});

router.post('/add', isLoggedIn, async (req, res) => {
    const { producto, descripcion, precioCompra, precioVenta, cantidadComprados, gastosEnvio, gastosVarios, proveedor } = req.body;
    const nuevoProducto = {
        producto,
        descripcion,
        precioCompra,
        precioVenta,
        cantidadComprados,
        gastosEnvio,
        gastosVarios,
        proveedor,
        user_id: req.user.id
    };

    await pool.query('INSERT INTO comprastock set ?', [nuevoProducto]);
    req.flash('success', 'Compra guardada correctamente!');
    res.redirect('/compras');
});

router.get('/delete/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    await pool.query('DELETE FROM comprastock WHERE id = ?', [id]);
    req.flash('success', 'Compra removida satisfactoriamente');
    res.redirect('/compras');
});

router.get('/detalles/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const detalles = await pool.query('SELECT * FROM comprastock WHERE id = ?', [id]);
    res.render('compras/detalles', {detalles: detalles[0]});
});

router.get('/edit/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const compras = await pool.query('SELECT * FROM comprastock WHERE id = ?', [id]);
    const categorias = await pool.query('SELECT * FROM categorias WHERE user_id = ?', [req.user.id]);
    res.render('compras/edit', {compra: compras[0], categorias: categorias});
});

router.post('/edit/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const { producto, descripcion, categoria, precioCompra, precioVenta, cantidadComprados, gastosEnvio, gastosVarios, proveedor } = req.body;
    const nuevoProducto = {
        producto,
        descripcion,
        categoria,
        precioCompra,
        precioVenta,
        cantidadComprados,
        gastosEnvio,
        gastosVarios,
        proveedor,
        user_id: req.user.id
    };
    await pool.query('UPDATE comprastock set ? WHERE id = ?', [nuevoProducto, id]);
    req.flash('success', 'Compra editada satisfactoriamente');
    res.redirect('/compras');
});

module.exports = router;