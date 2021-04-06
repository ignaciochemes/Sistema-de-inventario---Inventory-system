const express = require('express');
const router = express.Router();

const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');


router.get('/add/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const categorias = await pool.query('SELECT * FROM categorias WHERE user_id = ?', [req.user.id]);
    const articulosCreados = await pool.query('SELECT * FROM articulos WHERE user_id = ?', [req.user.id]);
    res.render('miStock/add', {categorias: categorias, articulosCreados: articulosCreados});
});

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

//Ruta vieja con modal
// router.post('/add/:id', isLoggedIn, async (req, res) => {
//     let tito = "";
//     //Requerimos el objeto desde req.body
//     const { producto, descripcion, categoria, precioCompra, precioVenta, cantidad, cantidadVendidos, foto} = req.body;
//     //Almacenamos el objeto en una constante como objeto
//     const seleccionDeProductosXUsuario = await pool.query('SELECT producto FROM stock WHERE user_id = ?', [req.user.id]);
//     seleccionDeProductosXUsuario.forEach((anibales) => {
//         if (anibales.producto === producto) {
//             return tito = producto;
//         };
//     });

//     if (tito.length) {
//         const updateProducto = {
//             producto,
//             descripcion,
//             categoria,
//             precioCompra,
//             precioVenta,
//             cantidad,
//             cantidadVendidos,
//             user_id: req.user.id
//         };
//         //Almacenamos el objeto en la base de datos
//         await pool.query('UPDATE stock SET ? WHERE producto = ? AND user_id = ?', [updateProducto, tito, req.user.id]);
//         req.flash('success', 'Producto guardado correctamente!');
//         res.redirect('/mistock');
//     } else {
//         const nuevoProducto = {
//             producto,
//             descripcion,
//             categoria,
//             precioCompra,
//             precioVenta,
//             cantidad,
//             cantidadVendidos,
//             user_id: req.user.id
//         };
//         //Almacenamos el objeto en la base de datos
//         await pool.query('INSERT INTO stock set ?', [nuevoProducto]);
//         req.flash('success', 'Producto guardado correctamente!');
//         res.redirect('/mistock');
//     }
// });

router.get('/', isLoggedIn, async (req, res) => {
    const articulos = await pool.query('SELECT * FROM stock WHERE user_id = ?', [req.user.id]);
    const categorias = await pool.query('SELECT * FROM categorias WHERE user_id = ?', [req.user.id]);
    const articulosCreados = await pool.query('SELECT * FROM articulos WHERE user_id = ?', [req.user.id]);
    const cartera = await pool.query('SELECT dineroEfectivo, dineroBanco FROM cartera WHERE user_id = ?', [req.user.id]);
    res.render('mistock/tabla2', {articulos: articulos, categorias: categorias, articulosCreados: articulosCreados, cartera: cartera[0]});
});

router.get('/tablados', isLoggedIn, async (req, res) => {
    const articulos = await pool.query('SELECT * FROM stock WHERE user_id = ?', [req.user.id]);
    const categorias = await pool.query('SELECT * FROM categorias WHERE user_id = ?', [req.user.id]);
    const articulosCreados = await pool.query('SELECT * FROM articulos WHERE user_id = ?', [req.user.id]);
    const cartera = await pool.query('SELECT dineroEfectivo, dineroBanco FROM cartera WHERE user_id = ?', [req.user.id]);
    const sumaArticulos = await pool.query('SELECT COUNT(*) FROM stock WHERE user_id = ?', [req.user.id]);
    res.render('mistock/tabla2', {articulos: articulos, categorias: categorias, articulosCreados: articulosCreados, cartera: cartera[0], sumaArticulos: sumaArticulos[0]}); 
});

//Creamos una ruta especifica para escuchar el evento de eliminar etiqueta
router.get('/delete/:id', isLoggedIn, async (req, res) => {
    //Desde req.params requiero unicamente el id.
    const { id } = req.params;
    const cantidadABorrar = await pool.query('SELECT cantidad FROM stock WHERE id = ?', [id]);
    await pool.query('UPDATE cantidadarticulos SET totalArticulos = totalArticulos - ? WHERE user_id = ?', [cantidadABorrar[0].cantidad, req.user.id]);
    //Ejecutamos una una consulta query eiliminando el id almacenado en la constante de arriba
    await pool.query('DELETE FROM stock WHERE ID = ?', [id]);
    //Ejecutamos Flash para mostrar la alerta
    req.flash('success', 'Producto removido satisfactoriamente');
    //Redireccionamos a la misma lista
    res.redirect('/mistock/tablados');
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

router.get('/masunoefectivo/:id', async (req, res) => {
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
    await pool.query('UPDATE cartera SET dineroEfectivo = dineroEfectivo + (SELECT precioVenta FROM stock WHERE id = ?) WHERE user_id = ?', [id, req.user.id]);
    
    const selectNA2 = await pool.query('SELECT * FROM stock WHERE id = ?', [id]);
    const artVentaInsertar = {
        producto: selectNA2[0].producto,
        descripcion: selectNA2[0].descripcion,
        cliente: 'Venta Rapida',
        cantidadVendidos: 1,
        gananciaBruta: selectNA2[0].precioVenta,
        gananciaNeta: selectNA2[0].precioVenta - selectNA2[0].precioCompra,
        montoVenta: selectNA2[0].precioVenta,
        montoVentaNeto: selectNA2[0].precioVenta - selectNA2[0].precioCompra,
        metodo: 'Efectivo',
        user_id: req.user.id
    };
    await pool.query('INSERT INTO ventasstock SET ?', [artVentaInsertar]);
    //await pool.query('UPDATE ventasstock SET gananciaBruta = (SELECT precioVenta FROM stock WHERE id = ?) WHERE id = ?', [id, id]);
    //await pool.query('UPDATE ventasstock SET gananciaNeta = (SELECT precioCompra FROM stock WHERE id = ?) WHERE id = ?', [id, id]);
    //await pool.query('UPDATE ventasstock SET montoVenta = gananciaBruta WHERE id = ?', [id]);
    req.flash('success', 'Articulo vendido!');
    res.redirect('/mistock/tablados')
});

router.get('/masunobanco/:id', async (req, res) => {
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
    await pool.query('UPDATE cartera SET dineroBanco = dineroBanco + (SELECT precioVenta FROM stock WHERE id = ?) WHERE user_id = ?', [id, req.user.id]);
    
    const selectNA2 = await pool.query('SELECT * FROM stock WHERE id = ?', [id]);
    const artVentaInsertar = {
        producto: selectNA2[0].producto,
        descripcion: selectNA2[0].descripcion,
        cliente: 'Venta Rapida',
        cantidadVendidos: 1,
        gananciaBruta: selectNA2[0].precioVenta,
        gananciaNeta: selectNA2[0].precioVenta - selectNA2[0].precioCompra,
        montoVenta: selectNA2[0].precioVenta,
        montoVentaNeto: selectNA2[0].precioVenta - selectNA2[0].precioCompra,
        metodo: 'Tarjeta',
        user_id: req.user.id
    };
    await pool.query('INSERT INTO ventasstock SET ?', [artVentaInsertar]);
    //await pool.query('UPDATE ventasstock SET gananciaBruta = (SELECT precioVenta FROM stock WHERE id = ?) WHERE id = ?', [id, id]);
    //await pool.query('UPDATE ventasstock SET gananciaNeta = (SELECT precioCompra FROM stock WHERE id = ?) WHERE id = ?', [id, id]);
    //await pool.query('UPDATE ventasstock SET montoVenta = gananciaBruta WHERE id = ?', [id]);
    req.flash('success', 'Articulo vendido!');
    res.redirect('/mistock/tablados')
});

router.get('/vender/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const articulos = await pool.query('SELECT * FROM stock WHERE id = ?', [id]);
    res.render('mistock/vender', {articulo: articulos[0]});
});

router.post('/vender/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const { metodo, producto, descripcion, cliente, cantidadVendidos, gananciaBruta, gananciaNeta } = req.body;
    const montoVenta = cantidadVendidos * gananciaBruta;
    const montoVentaNeto = montoVenta - (cantidadVendidos * gananciaNeta);
    const nuevoProducto = {
        producto,
        descripcion,
        cliente,
        cantidadVendidos,
        gananciaBruta,
        gananciaNeta,
        montoVenta,
        montoVentaNeto,
        metodo,
        user_id: req.user.id
    };

    let cantidad = nuevoProducto.cantidadVendidos;
    let gananciaB = nuevoProducto.gananciaBruta;
    let gananciaN = nuevoProducto.gananciaNeta;
    //let montoTotal = nuevoProducto.gananciaBruta * cantidad;
    //console.log(parseFloat(nuevoProducto.cantidadVendidos));
    await pool.query('UPDATE stock SET cantidad = cantidad - ? WHERE id = ?', [cantidad, id]);
    await pool.query('UPDATE stock SET cantidadVendidos = cantidadVendidos + ? WHERE id = ?', [cantidad, id]);
    await pool.query('UPDATE stock SET gananciaBruta = gananciaBruta + ? WHERE id = ?', [gananciaB, id]);
    await pool.query('UPDATE stock SET gananciaNeta = gananciaNeta + ? WHERE id = ?', [gananciaN, id]);
    
    await pool.query('INSERT INTO ventasstock SET ?', [nuevoProducto]);
    req.flash('success', 'Producto guardado correctamente!');
    res.redirect('/mistock');
});

module.exports = router;

//Para ver los datos que estamos recibiendo usamos REQ.BODY