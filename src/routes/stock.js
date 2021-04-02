const express = require('express');
const router = express.Router();

const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');


router.get('/add', isLoggedIn, (req, res) => {
    res.render('miStock/add');
});

router.post('/add', isLoggedIn, async (req, res) => {
    //Requerimos el objeto desde req.body
    const { producto, descripcion, categoria, precioCompra, precioVenta, cantidad, cantidadVendidos, foto} = req.body;
    //Almacenamos el objeto en una constante como objeto
    const nuevoProducto = {
        producto,
        descripcion,
        categoria,
        precioCompra,
        precioVenta,
        cantidad,
        cantidadVendidos,
        foto,
        user_id: req.user.id
    };
    //Almacenamos el objeto en la base de datos
    await pool.query('INSERT INTO stock set ?', [nuevoProducto]);
    req.flash('success', 'Producto guardado correctamente!');
    res.redirect('/mistock');
});

router.get('/', isLoggedIn, async (req, res) => {
    const articulos = await pool.query('SELECT * FROM stock WHERE user_id = ?', [req.user.id]);
    const categorias = await pool.query('SELECT * FROM categorias WHERE user_id = ?', [req.user.id]);
    res.render('mistock/tabla', {articulos: articulos, categorias: categorias});
});

//Creamos una ruta especifica para escuchar el evento de eliminar etiqueta
router.get('/delete/:id', isLoggedIn, async (req, res) => {
    //Desde req.params requiero unicamente el id.
    const { id } = req.params;
    //Ejecutamos una una consulta query eiliminando el id almacenado en la constante de arriba
    await pool.query('DELETE FROM stock WHERE ID = ?', [id]);
    //Ejecutamos Flash para mostrar la alerta
    req.flash('success', 'Producto removido satisfactoriamente');
    //Redireccionamos a la misma lista
    res.redirect('/mistock');
});

//Creamos una ruta para editar los links
router.get('/edit/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    //Consultamos a la base de datos para obtener los datos del objeto a editar
    const articulos = await pool.query('SELECT * FROM stock WHERE id = ?', [id]);
    const categorias = await pool.query('SELECT * FROM categorias WHERE user_id = ?', [req.user.id]);
    res.render('mistock/edit', {articulo: articulos[0], categorias: categorias});
});

//Creamos una ruta con metodo post para editar los links filtrados por id
router.post('/edit/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    //Tambien quiero asegurarme de recibir los datos del formulario con req.body
    //Estos son los datos nuevos que me envia el formulario
    const { producto, descripcion, categoria, precioCompra, precioVenta, cantidad, cantidadVendidos } = req.body;
    const nuevoProducto = {
        producto,
        descripcion,
        categoria,
        precioCompra,
        precioVenta,
        cantidad,
        cantidadVendidos,
        user_id: req.user.id
    };
    //Actualiza desde la tabla links un conjunto de datos en donde id sea igual a id
    await pool.query('UPDATE stock set ? WHERE id = ?', [nuevoProducto, id]);
    //Ejecutamos el metodo flash para enviar la alerta
    req.flash('success', 'Articulo editado satisfactoriamente');
    res.redirect('/mistock');
});

router.get('/masuno/:id', async (req, res) => {
    const { producto, descripcion, categoria, precioCompra, precioVenta, cantidad, cantidadVendidos } = req.body;
    const { id } = req.params;
    const nuevoArticulo = {
        producto,
        descripcion,
        categoria,
        precioCompra,
        precioVenta,
        cantidad,
        cantidadVendidos,
        user_id: req.user.id
    };
    await pool.query('SELECT ? FROM stock WHERE id = ?', [nuevoArticulo, id]);
    await pool.query('UPDATE stock SET cantidad = cantidad - 1 WHERE id = ?', [id]);
    await pool.query('UPDATE stock SET cantidadVendidos = cantidadVendidos + 1 WHERE id = ?', [id]);
    await pool.query('UPDATE stock SET gananciaBruta = precioVenta * cantidadVendidos WHERE id = ?', [id]);
    await pool.query('UPDATE stock SET gananciaNeta = (precioVenta - precioCompra) * cantidadVendidos WHERE id = ?', [id]);
    await pool.query('UPDATE stock SET gananciaBrutaTotal = (SELECT SUM(gananciaBruta) FROM stock WHERE user_id = ?) WHERE user_id = ?', [req.user.id, req.user.id]);
    await pool.query('UPDATE stock SET gananciaNetaTotal = (SELECT SUM(gananciaNeta) FROM stock WHERE user_id = ?) WHERE user_id = ?', [req.user.id, req.user.id]);
    req.flash('success', 'Articulo vendido!');
    res.redirect('/mistock')
});

router.get('/vender/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const articulos = await pool.query('SELECT * FROM stock WHERE id = ?', [id]);
    res.render('mistock/vender', {articulo: articulos});
});

router.post('/vender/:id', isLoggedIn, async (req, res) => {
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

    await pool.query('INSERT INTO ventasstock set ?', [nuevoProducto]);
    req.flash('success', 'Producto guardado correctamente!');
    res.redirect('/mistock');
});

module.exports = router;

//Para ver los datos que estamos recibiendo usamos REQ.BODY