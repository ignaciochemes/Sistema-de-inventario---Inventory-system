const bcrypt = require('bcryptjs');

const helpers = {};

helpers.encryptPassword = async (password) => { //Password = la clave tal cual como tipea el cliente
    const salt = await bcrypt.genSalt(15); //Cuantas veces va a encriptar la pass
    const passwordHash = await bcrypt.hash(password, salt); //Encripta la pass
    return passwordHash;
};

helpers.matchPassword = async (password, savedPassword) => { //Password = la clave tal cual como tipea el cliente - savedPassword es la clave encriptada en DB
    try {
        return await bcrypt.compare(password, savedPassword); //Con este metodo comparamos las claves
    } catch(e) {
        console.log(e);
    }
}

module.exports = helpers;