const moment = require('moment');
const { format } = require('timeago.js');

const helpers = {};

helpers.timeago = (timestamp) => {
    return format(timestamp);
};

//MOMENT

helpers.momentAgo = (timestamp) => {
    moment.locale('es');
    return moment(timestamp).format("dddd, MMMM Do YYYY, h:mm:ss a");
};

helpers.momentAgoHaceTanto = (timestamp) => {
    moment.locale('es');
    return moment(timestamp).startOf('day').fromNow(); 
};

helpers.ifMayor = function(a, b, opciones) {
    if (a <= b) {
        return opciones.fn(this);
    } else {
        return opciones.inverse(this)
    }
};

helpers.ifMenor = function(a, b, opciones) {
    if (a <= b) {
        return opciones.fn(this);
    } else {
        return opciones.inverse(this)
    }
};

helpers.ifMetodo = function(a, b, opciones) {
    if (a === b) {
        return opciones.fn(this);
    } else {
        return opciones.inverse(this)
    }
};

module.exports = helpers; 