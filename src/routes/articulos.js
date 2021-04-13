const express = require('express');
const router = express.Router();

const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');


router.get('/', isLoggedIn, async (req, res) => {
    let user = req.user.id;
    const articulos = await pool.query('SELECT * FROM articulos WHERE user_id = ?', [user]);
    const proveedor = await pool.query('SELECT * FROM proveedores WHERE user_id = ?', [user]);
    const categorias = await pool.query('SELECT * FROM categorias WHERE user_id = ?', [user]);
    res.render('articulos/tabla', {articulos: articulos, proveedor: proveedor, categorias: categorias});
});

router.get('/add', isLoggedIn, async (req, res) => {
    let user = req.user.id;
    const categorias = await pool.query('SELECT * FROM categorias WHERE user_id = ?', [user]);
    const proveedores = await pool.query('SELECT empresa FROM proveedores WHERE user_id = ?', [user])
    res.render('articulos/addarticulo', {categorias: categorias, proveedores: proveedores});
})

router.post('/add', isLoggedIn, async (req, res) => { 
    let user = req.user.id;
    let article_id_numero = 0;
    const { producto, descripcion, categoria, cantidadIngresados, precioVenta, precioCosto, gastosEnvio, gastosVarios, proveedor } = req.body;
    //const seleccionDeProductosXUsuario = await pool.query('SELECT producto FROM articulos WHERE user_id = ?', [user]);
    
    const articleId = await pool.query('SELECT article_id FROM articulos ORDER BY id DESC LIMIT 1');
    if (!articleId[0]) {
        console.log('no')
        article_id_numero = 1;
    }
    if(articleId[0]) {
        console.log('si')
        article_id_numero = articleId[0].article_id + 1;
    };

    // if (seleccionDeProductosXUsuario[0]) {
    //     const updateProducto = {
    //         producto: producto,
    //         descripcion: descripcion,
    //         categoria: categoria,
    //         cantidadIngresados: cantidadIngresados,
    //         precioVenta: precioVenta,
    //         precioCosto: precioCosto,
    //         proveedor: proveedor,
    //         user_id: user,
    //     };
    //     await pool.query('UPDATE stock SET ? WHERE article_id = ? AND user_id = ?', [updateProducto, seleccionDeProductosXUsuario[0].article_id, user]);
    //     req.flash('success', 'Producto guardado correctamente!');
    //     res.redirect('/articulos');
    //Insertamos el nuevo articulo en la base de datos
    const nuevoProducto = {
        producto: producto,
        descripcion: descripcion,
        categoria: categoria,
        cantidadIngresados: cantidadIngresados,
        precioVenta: precioVenta,
        precioCosto: precioCosto,
        proveedor: proveedor,
        user_id: user,
        article_id: article_id_numero
    };
    await pool.query('INSERT INTO articulos SET ?', [nuevoProducto]);
    //Insertamos una nueva compra
    const nuevaCompra = {
        producto: producto,
        descripcion: descripcion,
        categoria: categoria,
        precioCosto: precioCosto,
        precioVenta: precioVenta,
        cantidadIngresados: cantidadIngresados,
        gastosEnvio: gastosEnvio,
        gastosVarios: gastosVarios,
        proveedor: proveedor,
        user_id: user,
        article_id: article_id_numero
    };
    await pool.query('INSERT INTO comprastock SET ?', [nuevaCompra]);

    //Gastos
    const matchGastos = await pool.query('SELECT * FROM gastos WHERE user_id = ?', [user]);
    let gastosCompras = cantidadIngresados * precioCosto;
    const gastos = {
        gastosCompras: gastosCompras,
        gastosEnvios: gastosEnvio,
        gastosVarios: gastosVarios,
        user_id: user
    }
    if (!matchGastos[0]) {
        await pool.query('INSERT INTO gastos SET ?', [gastos]);
    }
    if (matchGastos[0]) {
        await pool.query('UPDATE gastos SET gastosCompras = gastosCompras + ?, gastosEnvios = gastosEnvios + ?, gastosVarios = gastosVarios + ? WHERE user_id = ?', 
        [gastosCompras, gastosEnvio, gastosVarios, user]);
    }
    req.flash('success', 'Articulo guardado correctamente!');
    res.redirect('/articulos');
});

router.get('/addtostock/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const articulos = await pool.query('SELECT * FROM articulos WHERE id = ?', [id]);
    res.render('articulos/addtostock', {articulo: articulos[0]});
});

router.post('/addtostock/:id', isLoggedIn, async (req, res) => {
    let user = req.user.id;
    const { id, producto, descripcion, categoria, precioCompra, precioVenta, cantidad } = req.body;
    const seleccionDeProductosXUsuario = await pool.query('SELECT id FROM stock WHERE user_id = ? AND id = ?', [user, id]);
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
              user_id: user
          };
          await pool.query('INSERT INTO stock SET ?', [nuevoProducto]);
          await pool.query('UPDATE articulos SET cantidadIngresados = cantidadIngresados - ? WHERE id = ? AND user_id = ?', [cantidad, id, user])
          req.flash('success', 'Producto guardado correctamente!');
          res.redirect('/articulos');
    } else {
            const updateProducto = {
            producto,
            categoria,
            precioCompra,
            precioVenta,
            descripcion,
            user_id: user
        };
        await pool.query('UPDATE stock SET ? WHERE id = ? AND user_id = ?', [updateProducto, id, user]);
        await pool.query('UPDATE stock SET cantidad = cantidad + ? WHERE id = ? AND user_id = ?', [cantidad, id, user]);
        await pool.query('UPDATE articulos SET cantidadIngresados = cantidadIngresados - ? WHERE id = ? AND user_id = ?', [cantidad, id, user]);
        req.flash('success', 'Producto guardado correctamente!');
        res.redirect('/articulos');
    }
});

router.get('/addnuevoingreso/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const articulos = await pool.query('SELECT * FROM articulos WHERE id = ?', [id]);
    const proveedores = await pool.query('SELECT empresa FROM proveedores WHERE user_id = ?', [req.user.id]);
    res.render('articulos/addnuevoingreso', {articulo: articulos[0], proveedores: proveedores});
});

router.post('/addnuevoingreso/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    let user = req.user.id;
    const getArticleId = await pool.query('SELECT * FROM articulos WHERE id = ?', [id]);
    console.log(getArticleId);
    const { producto, descripcion, categoria, precioCosto, precioVenta, cantidadIngresados, gastosEnvio, gastosVarios, proveedor } = req.body;

    //Enviamos los datos a la tabla compras
    const nuevoIngresoCompra = {
        producto: producto,
        descripcion: descripcion,
        categoria: categoria,
        precioCosto: precioCosto,
        precioVenta: precioVenta,
        cantidadIngresados: cantidadIngresados,
        gastosEnvio: gastosEnvio,
        gastosVarios: gastosVarios,
        proveedor: proveedor,
        user_id: user,
        article_id: getArticleId[0].article_id
    };

    //Agregamos los gastos
    const chequearGastos = await pool.query('SELECT user_id FROM gastos WHERE user_id = ?', [user]);
    let gastosCompras = cantidadIngresados * precioCosto;
    if (!chequearGastos[0]) {
        const nuevoGasto = {
            gastosCompras: gastosCompras,
            gastosVarios: gastosVarios,
            gastosEnvios: gastosEnvio,
            user_id: user 
        };
        await pool.query('INSERT INTO gastos SET ?', [nuevoGasto]);
    };
    if (chequearGastos[0].user_id) {
        await pool.query('UPDATE gastos SET gastosCompras = gastosCompras + ?, gastosVarios = gastosVarios + ?, gastosEnvios = gastosEnvios + ? WHERE user_id = ?',
        [gastosCompras, gastosVarios, gastosEnvio, user]);
    };
    await pool.query('INSERT INTO comprastock SET ?', [nuevoIngresoCompra]);

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