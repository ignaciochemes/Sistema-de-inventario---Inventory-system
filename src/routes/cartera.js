const express = require('express');
const router = express.Router();
const io = require('../index');

const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');


router.get('/', isLoggedIn, async (req, res) => {
    const cartera = await pool.query('SELECT * FROM cartera WHERE user_id = ?', [req.user.id]);
    const cartera2 = await pool.query('SELECT gananciaBrutaTotal, gananciaNetaTotal FROM stock WHERE user_id = ?', [req.user.id]);
    console.log(cartera2[0]);
    res.render('cartera/cartera', {cartera: cartera[0], carteraDos: cartera2[0]});
});

router.post('/addefectivo', isLoggedIn, async (req, res) => {
    const query = await pool.query('SELECT * FROM cartera WHERE user_id = ?', [req.user.id]);
    if (!query.length) {
        const { dineroEfectivo } = req.body;
        const nuevaCarga = {
            dineroEfectivo,
            user_id: req.user.id
        };
        //await pool.query('UPDATE cartera SET dineroEfectivo = ? WHERE user_id = ?', [nuevaCarga, req.user.id]);
        await pool.query('INSERT INTO cartera set ?', [nuevaCarga]);
        req.flash('success', 'Carga de dinero almacenada con exito!');
        res.redirect('/cartera');
    } else {
        const { dineroEfectivo } = req.body;
        const nuevaCarga = dineroEfectivo;
        await pool.query('UPDATE cartera SET dineroEfectivo = dineroEfectivo + ? WHERE user_id = ?', [nuevaCarga, req.user.id]);
        req.flash('success', 'Carga de dinero almacenada con exito!');
        res.redirect('/cartera');
    }
});

router.post('/addbanco', isLoggedIn, async (req, res) => {
    const query = await pool.query('SELECT * FROM cartera WHERE user_id = ?', [req.user.id]);
    if (!query.length) {
        const { dineroBanco } = req.body;
        const nuevaCarga = {
            dineroBanco,
            user_id: req.user.id
        };
        await pool.query('INSERT INTO cartera set ?', [nuevaCarga]);
        req.flash('success', 'Carga de dinero almacenada con exito!');
        res.redirect('/cartera');
    } else {
        const { dineroBanco } = req.body;
        const nuevaCarga = dineroBanco;
        await pool.query('UPDATE cartera SET dineroBanco = dineroBanco + ? WHERE user_id = ?', [nuevaCarga, req.user.id]);
        req.flash('success', 'Carga de dinero almacenada con exito!');
        res.redirect('/cartera');
    };
});

router.post('/deletebanco', isLoggedIn, async (req, res) => {
    const query = await pool.query('SELECT * FROM cartera WHERE user_id = ?', [req.user.id]);
    if (!query.length) {
        const { dineroBanco } = req.body;
        const nuevaCarga = {
            dineroBanco,
            user_id: req.user.id
        };
        await pool.query('INSERT INTO cartera set ?', [nuevaCarga]);
        req.flash('success', 'Carga de dinero almacenada con exito!');
        res.redirect('/cartera');
    } else {
        const { dineroBanco } = req.body;
        const nuevaCarga = dineroBanco;
        await pool.query('UPDATE cartera SET dineroBanco = dineroBanco + ? WHERE user_id = ?', [nuevaCarga, req.user.id]);
        req.flash('success', 'Carga de dinero almacenada con exito!');
        res.redirect('/cartera');
    };
});

router.post('/deleteefectivo', isLoggedIn, async (req, res) => {
    const query = await pool.query('SELECT * FROM cartera WHERE user_id = ?', [req.user.id]);
    if (!query.length) {
        const { dineroEfectivo } = req.body;
        const nuevaCarga = {
            dineroEfectivo,
            user_id: req.user.id
        };
        //await pool.query('UPDATE cartera SET dineroEfectivo = ? WHERE user_id = ?', [nuevaCarga, req.user.id]);
        await pool.query('INSERT INTO cartera set ?', [nuevaCarga]);
        req.flash('success', 'Carga de dinero almacenada con exito!');
        res.redirect('/cartera');
    } else {
        const { dineroEfectivo } = req.body;
        const nuevaCarga = dineroEfectivo;
        await pool.query('UPDATE cartera SET dineroEfectivo = dineroEfectivo + ? WHERE user_id = ?', [nuevaCarga, req.user.id]);
        req.flash('success', 'Carga de dinero almacenada con exito!');
        res.redirect('/cartera');
    }
});

module.exports = router;