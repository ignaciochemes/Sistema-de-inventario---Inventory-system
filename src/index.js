const express = require('express');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');
const mysqlStore = require('express-mysql-session');
const passport = require('passport');

const { database } = require('./keys');

//Inicio express y extras
const app = express();
const socketio = require('socket.io');
require('./lib/passport');

//Socket IO
const server = require('http').Server(app);
const io = socketio(server);

//Opciones
app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars')
}));
app.set('view engine', '.hbs');

//Middlewares
app.use(session({
    secret: 'tatochemessession',
    resave: false,
    saveUninitialized: false,
    store: new mysqlStore(database)
}));
app.use(flash());
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

//Variables globales
app.use((req, res, next) => {
    app.locals.success = req.flash('success');
    app.locals.message = req.flash('message');
    app.locals.user = req.user;
    next();
});

//Rutas del servidor
app.use(require('./routes/index'));
app.use(require('./routes/authentication'));
app.use('/mistock', require('./routes/stock'));
app.use('/proveedores', require('./routes/proveedores'));
app.use('/cartera', require('./routes/cartera'));
app.use('/compras', require('./routes/compras'));
app.use('/ventas', require('./routes/ventas'));
app.use('/categorias', require('./routes/categorias'));
app.use('/testeos', require('./routes/testeos'));
app.use('/articulos', require('./routes/articulos'));
app.use('/reportes', require('./routes/reportes'));

//Archivos publicos
app.use(express.static(path.join(__dirname, 'public')))

//Arrancar el servidor
server.listen(app.get('port'), () => {
    console.log('Servidor prendido en el puerto', app.get('port'));
});

setInterval(estadisticas, 1000);
function estadisticas() {
    const os = require('os');
    const osut = require('os-utils');

    osut.cpuUsage(function(v) {
        let segundos = os.uptime();
        let minutos = segundos/60;
        let horas = minutos/60;

        segundos = Math.floor(segundos);
        minutos = Math.floor(minutos);
        horas = Math.floor(horas);

        horas = horas%60;
        minutos = minutos%60;
        segundos = segundos%60;

        let data = {
            status: "Ok",
            uptime: `${horas}:${minutos}:${segundos} hs`,
            usoCpu: Math.round(v*1000)/10+"%",
            usoRam: Math.floor((os.totalmem() - os.freemem())/os.totalmem()*1000)/10+"%"
        }
        io.emit("datainfo", data);
    });
};