const express = require('express');
const router = express.Router();

const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');


router.get('/', isLoggedIn, async (req, res) => {
    const compra = await pool.query('SELECT * FROM comprastock WHERE user_id = ?', [req.user.id]);
    const proveedor = await pool.query('SELECT * FROM proveedores WHERE user_id = ?', [req.user.id]);
    const categorias = await pool.query('SELECT titulo FROM categorias WHERE user_id = ?', [req.user.id]);
    res.render('compras/tabla', {compras: compra, proveedores: proveedor, categorias: categorias});
});

router.get('/add', isLoggedIn, async (req, res) => {
    const proveedores = await pool.query('SELECT * FROM proveedores WHERE user_id = ?', [req.user.id]);
    const categorias = await pool.query('SELECT titulo FROM categorias WHERE user_id = ?', [req.user.id]);
    res.render('compras/add', {proveedores: proveedores, categorias: categorias});
});

router.post('/add', isLoggedIn, async (req, res) => {
    let user = req.user.id;
    let pedro;

    let existeArticulo = await pool.query('SELECT article_id FROM comprastock ORDER BY comprastock.article_id DESC LIMIT 1');
    let totalArticulos = await pool.query('SELECT totalArticulos FROM cantidadarticulos WHERE user_id = ?', [user]);
    //Pedro
    if (!existeArticulo[0]) {
        pedro = 1;
    };
    if (existeArticulo[0]) {
        pedro = existeArticulo[0].article_id + 1;
    };
    const { producto, descripcion, categoria, precioCosto, precioVenta, cantidadIngresados, gastosEnvio, gastosVarios, proveedor } = req.body;
    const nuevoProducto = {
        producto,
        descripcion,
        categoria,
        precioCosto,
        precioVenta,
        cantidadIngresados,
        gastosEnvio,
        gastosVarios,
        proveedor,
        article_id: pedro,
        user_id: user
    };
    const nuevoProductoEnArticulos = {
        producto,
        descripcion,
        categoria,
        precioCosto,
        precioVenta,
        cantidadIngresados,
        proveedor,
        article_id: pedro,
        user_id: user
    };
    const nuevoTotalArticulos = {
        totalArticulos: cantidadIngresados,
        user_id: user
    };
    //
    if(!totalArticulos[0]) {
        await pool.query('INSERT INTO cantidadarticulos SET ?', [nuevoTotalArticulos]);
    } else {
        await pool.query('UPDATE cantidadarticulos SET totalArticulos = totalArticulos + ? WHERE user_id = ?', [nuevoTotalArticulos.totalArticulos, user]);
    }
    
    await pool.query('INSERT INTO comprastock set ?', [nuevoProducto]);
    await pool.query('INSERT INTO articulos set ?', [nuevoProductoEnArticulos]);
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

router.get('/deleteall', isLoggedIn, async (req, res) => {
    await pool.query('DELETE FROM comprastock WHERE user_id = ?', [req.user.id]);
    res.send('TODO ELIMINADO');
});

router.get('/edit/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const compras = await pool.query('SELECT * FROM comprastock WHERE id = ?', [id]);
    const categorias = await pool.query('SELECT * FROM categorias WHERE user_id = ?', [req.user.id]);
    res.render('compras/edit', {compra: compras[0], categorias: categorias});
});

router.post('/edit/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const { producto, descripcion, categoria, precioCosto, precioVenta, cantidadIngresados, gastosEnvio, gastosVarios, proveedor } = req.body;
    let seleccionArticleId = await pool.query('SELECT article_id FROM comprastock WHERE id = ?', [id]);
    const nuevoProducto = {
        producto,
        descripcion,
        categoria,
        precioCosto,
        precioVenta,
        cantidadIngresados,
        gastosEnvio,
        gastosVarios,
        proveedor,
        user_id: req.user.id
    };
    const updateProductoEnArticulos = {
        producto,
        descripcion,
        categoria,
        precioCosto,
        precioVenta,
        cantidadIngresados,
        proveedor,
        user_id: req.user.id
    };
    await pool.query('UPDATE comprastock SET ? WHERE id = ?', [nuevoProducto, id]);
    await pool.query('UPDATE articulos SET ? WHERE article_id = ?', [updateProductoEnArticulos, seleccionArticleId[0].article_id]);
    req.flash('success', 'Compra editada satisfactoriamente');
    res.redirect('/compras');
});

module.exports = router;