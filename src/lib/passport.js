const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const pool = require('../database');
const helpers = require('../lib/helpers');

//Login
passport.use('local.signin', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {
    
    const rows = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    if (rows.length > 0) {
        const user = rows[0];
        const validPassword = await helpers.matchPassword(password, user.password);
        if (validPassword) {
            done(null, user, req.flash('success', 'Bienvenido!' + user.username));
        } else {
            done(null, false, req.flash('message', 'Contraseña incorrecta'))
        }
    } else {
        return done(null, false, req.flash('message', 'El nombre de usuario no existe'))
    }

}));

//Registro
passport.use('local.signup', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {
    const { fullname } = req.body;
    const newUser = {
        username: username,
        password: password,
        fullname: fullname

    };
    newUser.password = await helpers.encryptPassword(password);
    const result = await pool.query('INSERT INTO users SET ?', [newUser]);
    newUser.id = result.insertId; //Con esto le agregamos al usuario, el user id
    return done(null, newUser); //Con el Donde le decimos al servidor que continue con la carga. Null por si hay algun error, newUser para que se almacene en una sesion
}));

//Vamos a almacenar en session los datos obtenidos arriba
//Cuando serializo estoy guardando el id del usuario
passport.serializeUser((user, done) => {
    done(null, user.id);
});

//Cuando deserializo estoy obteniendo ese id para volver a obtener los datos
passport.deserializeUser(async (id, done) => {
    const rows = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    done(null, rows[0]);
})