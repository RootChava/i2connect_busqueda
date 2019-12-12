const { search_query } = require('./database');
const queryTodosCliente = "SELECT id, nombre, apellidop, apellidom FROM personas";
const queryObtenerClienteTermino = "SELECT id, nombre, apellidop, apellidom FROM personas WHERE nombre like ? OR apellidop like ? or apellidom like ?";

module.exports = {
    obtenerTodosCliente: () => {
        return search_query(queryTodosCliente);
    },
    obtenerClienteTermino: (term) => {
        return search_query(queryObtenerClienteTermino, '%' + term + '%', '%' + term + '%', '%' + term + '%');
    }
};