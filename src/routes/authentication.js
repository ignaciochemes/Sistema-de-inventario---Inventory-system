const express = require('express');
const router = express.Router();

const passport = require('passport');
const pool = require('../database');
const { isLoggedIn, isNotLoggedIn } = require('../lib/auth');

//Rutas de registro
router.get('/signup', isNotLoggedIn, (req, res) => {
    res.render('auth/signup')
});

router.post('/signup', isNotLoggedIn, passport.authenticate('local.signup', {
    successRedirect: '/profile',
    failureRedirect: '/signup',
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
    const gananciasBrutas = await pool.query('SELECT gananciaBrutaTotal FROM stock WHERE user_id = ?', [req.user.id]);
    const gananciasNetas = await pool.query('SELECT gananciaNetaTotal FROM stock WHERE user_id = ?', [req.user.id]);
    console.log(gananciasBrutas[0], gananciasNetas[0]);
    res.render('profile2', {gananciasBrutas: gananciasBrutas[0], gananciasNetas: gananciasNetas[0]});
});

router.get('/logout', isLoggedIn, (req, res) => {
    req.logOut();
    res.redirect('/');
});

module.exports = router;