const express = require('express');
const router = express.Router();

const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');


router.get('/', isLoggedIn, async (req, res) => {
    const articulos = await pool.query('SELECT * FROM articulos WHERE user_id = ?', [req.user.id]);
    const proveedor = await pool.query('SELECT * FROM proveedores WHERE user_id = ?', [req.user.id]);
    const categorias = await pool.query('SELECT * FROM categorias WHERE user_id = ?', [req.user.id]);
    res.render('articulos/tabla', {articulos: articulos, proveedor: proveedor, categorias: categorias});
});

router.post('/add', isLoggedIn, async (req, res) => { 
    let tito = "";
    const { producto, descripcion, categoria, cantidadIngresados, precioVenta, precioCosto, proveedor } = req.body;
    const seleccionDeProductosXUsuario = await pool.query('SELECT producto FROM articulos WHERE user_id = ?', [req.user.id]);
    seleccionDeProductosXUsuario.forEach((anibales) => {
        if (anibales.producto === producto) {
            return tito = producto;
        };
    });

    if (tito.length) {
        const updateProducto = {
            producto,
            descripcion,
            categoria,
            cantidadIngresados,
            precioVenta,
            precioCosto,
            proveedor,
            user_id: req.user.id
        };
        await pool.query('UPDATE stock SET ? WHERE producto = ? AND user_id = ?', [updateProducto, tito, req.user.id]);
        req.flash('success', 'Producto guardado correctamente!');
        res.redirect('/articulos');
    } else {
        const nuevoProducto = {
            producto,
            descripcion,
            categoria,
            cantidadIngresados,
            precioVenta,
            precioCosto,
            proveedor,
            user_id: req.user.id
        };
        await pool.query('INSERT INTO articulos SET ?', [nuevoProducto]);
        req.flash('success', 'Producto guardado correctamente!');
        res.redirect('/articulos');
    }
});

router.get('/addtostock/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const articulos = await pool.query('SELECT * FROM articulos WHERE id = ?', [id]);
    res.render('articulos/addtostock', {articulo: articulos[0]});
});

router.post('/addtostock/:id', isLoggedIn, async (req, res) => {
    const { id, producto, descripcion, categoria, precioCompra, precioVenta, cantidad } = req.body;
    const seleccionDeProductosXUsuario = await pool.query('SELECT id FROM stock WHERE user_id = ? AND id = ?', [req.user.id, id]);
    //if (seleccionDeProductosXUsuario[0].id === parseInt(id, 10)) {
    //let parse = parseInt(seleccionDeProductosXUsuario[0].id, 10); 
    if (!seleccionDeProductosXUsuario.length) {
          const nuevoProducto = {
              id,
              producto,
              categoria,
              precioCompra,
              precioVenta,
              descripcion,
              cantidad,
              user_id: req.user.id
          };
          await pool.query('INSERT INTO stock SET ?', [nuevoProducto]);
          await pool.query('UPDATE articulos SET cantidadIngresados = cantidadIngresados - ? WHERE id = ? AND user_id = ?', [cantidad, id, req.user.id])
          req.flash('success', 'Producto guardado correctamente!');
          res.redirect('/articulos');
    } else {
            const updateProducto = {
            producto,
            categoria,
            precioCompra,
            precioVenta,
            descripcion,
            user_id: req.user.id
        };
        await pool.query('UPDATE stock SET ? WHERE id = ? AND user_id = ?', [updateProducto, id, req.user.id]);
        await pool.query('UPDATE stock SET cantidad = cantidad + ? WHERE id = ? AND user_id = ?', [cantidad, id, req.user.id]);
        await pool.query('UPDATE articulos SET cantidadIngresados = cantidadIngresados - ? WHERE id = ? AND user_id = ?', [cantidad, id, req.user.id]);
        req.flash('success', 'Producto guardado correctamente!');
        res.redirect('/articulos');
    }
});

router.get('/addnuevoingreso/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const articulos = await pool.query('SELECT * FROM articulos WHERE id = ?', [id]);
    res.render('articulos/addnuevoingreso', {articulo: articulos[0]});
});

router.post('/addnuevoingreso/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const { cantidadIngresados } = req.body;
    const actualizadCI = cantidadIngresados;
    
    await pool.query('UPDATE articulos set cantidadIngresados = ? WHERE id = ?', [actualizadCI, id]);
    req.flash('success', `Stock agregado al articulo ${id} satisfactoriamente con un ingreso de ${actualizadCI}`);
    res.redirect('/articulos');
});

router.get('/delete/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    await pool.query('DELETE FROM articulos WHERE id = ?', [id]);
    req.flash('success', 'Producto removido satisfactoriamente');
    res.redirect('/articulos');
});

router.get('/edit/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const articulos = await pool.query('SELECT * FROM articulos WHERE id = ?', [id]);
    const categorias = await pool.query('SELECT * FROM categorias WHERE user_id = ?', [req.user.id]);
    res.render('articulos/edit', {articulo: articulos[0], categorias: categorias});
});

router.post('/edit/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const { producto, descripcion, categoria, precioCosto, precioVenta, proveedor } = req.body;
    const nuevoProducto = {
        producto,
        descripcion,
        categoria,
        descripcion,
        precioCosto,
        precioVenta,
        proveedor,
        user_id: req.user.id
    };
    await pool.query('UPDATE articulos set ? WHERE id = ?', [nuevoProducto, id]);
    req.flash('success', 'Articulo editado satisfactoriamente');
    res.redirect('/articulos');
});

module.exports = router;