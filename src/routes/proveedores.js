const express = require('express');
const router = express.Router();

const pool = require('../database');
const { isLoggedIn, isNotLoggedIn } = require('../lib/auth');

router.get('/', isLoggedIn, async (req, res) => {
    const proveedores = await pool.query('SELECT * FROM proveedores WHERE user_id = ?', [req.user.id]);
    console.log(proveedores);
    res.render('proveedores/proveedores', {proveedor: proveedores});
});

router.get('/add', isLoggedIn, (req, res) => {
    res.render('proveedores/add')
});

router.post('/add', isLoggedIn, async (req, res) => {
    const { nombre, apellido, empresa, email, telefono, telefono2, descripcion, deuda, activo } = req.body;
    const nuevoProveedor = {
        nombre,
        apellido,
        empresa,
        email,
        telefono,
        telefono2,
        descripcion,
        deuda,
        activo,
        user_id: req.user.id
    };
    await pool.query('INSERT INTO proveedores set ?', [nuevoProveedor]);
    req.flash('success', 'Proveedor guardado con exito!');
    res.redirect('/proveedores');
});

router.get('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const proveedores = await pool.query('SELECT * FROM proveedores WHERE id = ?', [id]);
    res.render('proveedores/edit', {proveedor: proveedores[0]});
});

router.post('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre, apellido, empresa, email, telefono, telefono2, descripcion, deuda, activo, comprasTotales, pesosTotales } = req.body;
    const nuevoProveedor = {
        nombre,
        apellido,
        empresa,
        email,
        telefono,
        telefono2,
        descripcion,
        deuda,
        activo,
        comprasTotales,
        pesosTotales
    };
    await pool.query('UPDATE proveedores set ? WHERE id = ?', [nuevoProveedor, id]);
    req.flash('success', 'Proveedor editado satisfactoriamente!');
    res.redirect('/proveedores');
});

router.get('/delete/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    await pool.query('DELETE FROM proveedores WHERE id = ?', [id]);
    req.flash('success', 'Proveedor removido satisfactoriamente!');
    res.redirect('/proveedores');
});


module.exports = router;
