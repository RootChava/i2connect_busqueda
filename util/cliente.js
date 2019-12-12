const { obtenerTodosCliente, obtenerClienteTermino } = require('../db/clienteDB');

const parsearCliente = (cliente) => {
    return {
        id: cliente.id.toString(),
        typeId: "TENT1",
        properties: {
            TP12: cliente.nombre,
            TP15: cliente.apellidop,
            TP16: cliente.apellidom
        }
    }
};

module.exports = {
    buscarTodosClientes: async () => {
        const clientes = await obtenerTodosCliente().catch((error) => {
            console.log(error);
            next(error);
        });
        return clientes.map(parsearCliente);
    },
    buscarClienteTermino: async (termino) => {
        const clientes = await obtenerClienteTermino(termino).catch((error) => {
            console.log(error);
            next(error);
        });
        return clientes.map(parsearCliente);
    }
}