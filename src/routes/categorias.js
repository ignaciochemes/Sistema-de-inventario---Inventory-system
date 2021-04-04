const express = require('express');
const router = express.Router();

const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');


router.get('/add', isLoggedIn, (req, res) => {
    res.render('categorias/add');
});

router.post('/add', isLoggedIn, async (req, res) => {
    const { titulo, descripcion } = req.body;
    const nuevoProducto = {
        titulo,
        descripcion,
        user_id: req.user.id
    };
    await pool.query('INSERT INTO categorias set ?', [nuevoProducto]);
    req.flash('success', 'Categoria guardada correctamente!');
    res.redirect('/categorias');
});

router.get('/', isLoggedIn, async (req, res) => {
    const categorias = await pool.query('SELECT * FROM categorias WHERE user_id = ?', [req.user.id]);
    res.render('categorias/list', {categoria: categorias});
});

router.get('/delete/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    await pool.query('DELETE FROM categorias WHERE id = ?', [id]);
    req.flash('success', 'Categoria removida satisfactoriamente');
    res.redirect('/categorias');
});

router.get('/edit/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const categorias = await pool.query('SELECT * FROM categorias WHERE id = ?', [id]);
    res.render('categorias/edit', {categoria: categorias[0]});
});

router.post('/edit/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const { titulo, descripcion } = req.body;
    const nuevoProducto = {
        titulo,
        descripcion,
        user_id: req.user.id
    };
    await pool.query('UPDATE categorias SET ? WHERE id = ?', [nuevoProducto, id]);
    req.flash('success', 'Categoria editada satisfactoriamente');
    res.redirect('/categorias');
});

module.exports = router;