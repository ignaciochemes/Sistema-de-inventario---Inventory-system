const express = require('express');
const router = express.Router();

const passport = require('passport');
const pool = require('../database');
const { isLoggedIn, isNotLoggedIn } = require('../lib/auth');

//Rutas de registro
router.get('/signup/registrar/cuenta', isNotLoggedIn, (req, res) => {
    res.render('auth/signup')
});

router.post('/signup/registrar/cuenta', isNotLoggedIn, passport.authenticate('local.signup', {
    successRedirect: '/profile',
    failureRedirect: '/signup/registrar/cuenta',
    failureFlash: true
}));

//Rutas de Login
router.get('/signin', isNotLoggedIn, (req, res) => {
    res.render('auth/signin')
});

router.post('/signin', isNotLoggedIn, (req, res, next) => {
    passport.authenticate('local.signin', {
        successRedirect: '/profile',
        failureRedirect: '/signin',
        failureFlash: true
    })(req, res, next);
});

router.get('/profile', isLoggedIn, async (req, res) => {
    let user = req.user.id;
    const ip = req.ip;
    const usuario = await pool.query('SELECT fullname FROM users WHERE id = ?', [user]);
    const gananciasBrutas = await pool.query('SELECT gananciaBrutaTotal FROM stock WHERE user_id = ?', [user]);
    const gananciasNetas = await pool.query('SELECT gananciaNetaTotal FROM stock WHERE user_id = ?', [user]);
    const articulos = await pool.query('SELECT producto FROM articulos WHERE user_id = ?', [user]);
    const articulosOrdenados = await pool.query('SELECT producto, cantidadVendidos FROM stock WHERE user_id = ? ORDER BY cantidadVendidos DESC LIMIT 10', [user]);
    const ultimasVentas = await pool.query('SELECT producto, metodo, cantidadVendidos, montoVenta FROM ventasstock WHERE user_id = ? ORDER BY id DESC LIMIT 11', [user]);
    
    //Calcular el beneficio neto
    const beneficioNeto = await pool.query('SELECT montoVenta, montoVentaNeto FROM ventasstock WHERE user_id = ?', [user]);
    let mapearArrayMontoVenta = beneficioNeto.map(obj => obj.montoVenta);
    let mapearArrayMontoVentaNeto = beneficioNeto.map(obj => obj.montoVentaNeto);
    let resultadoBeneficioBruto = mapearArrayMontoVenta.reduce(function(a, b) {
       return a + b
    }, 0);
    let resultadoBeneficioNeto = mapearArrayMontoVentaNeto.reduce(function(a, b) {
        return a + b
    }, 0);
    let gananciaNeta = resultadoBeneficioBruto - resultadoBeneficioNeto;
    let ingresoBruto = resultadoBeneficioBruto;
    //Compras
    const totalDineroGastado = await pool.query('SELECT precioCosto * cantidadIngresados AS Total FROM comprastock WHERE user_id = ?', [user]);
    let mapearArrayTotalGastadoCompra = totalDineroGastado.map(obj => obj.Total);
    let totalCompraProductos = mapearArrayTotalGastadoCompra.reduce(function(a, b) {
        return a + b
    }, 0);
    //Gastos
    const gastos = await pool.query('SELECT gastosEnvio, gastosVarios FROM comprastock WHERE user_id = ?', [user]);
    let mapearArrayGastos = gastos.map(obj => obj.gastosEnvio);
    let mapearArrayGastosVarios = gastos.map(obj => obj.gastosVarios);
    let gastosEnvio = mapearArrayGastos.reduce(function(a, b) {
        return a + b
    }, 0);
    let gastosVarios = mapearArrayGastosVarios.reduce(function(a, b) {
        return a + b
    }, 0);
    let gastosTotales = gastosEnvio + gastosVarios;
    res.render('profile2', {gananciasBrutas: gananciasBrutas[0], gananciasNetas: gananciasNetas[0], articulos: articulos, articulosOrdenados: articulosOrdenados,
        ultimasVentas: ultimasVentas, usuario: usuario[0], gananciaNeta: gananciaNeta, ingresoBruto: ingresoBruto, totalCompraProductos: totalCompraProductos,
        gastosTotales: gastosTotales, ip: ip, gastosEnvio: gastosEnvio, gastosVarios: gastosVarios});
});

router.get('/logout', isLoggedIn, (req, res) => {
    req.logOut();
    res.redirect('/');
});

module.exports = router;