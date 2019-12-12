const { valueFromCondition } = require('../util/utility');
const { buscarTodosClientes, buscarClienteTermino } = require('../util/cliente');

module.exports = {
    todosClientes: async (req, res, next) => {
        const term = valueFromCondition(req.body.payload.conditions, 'term');
        res.send({
            entities: term === '*' ? await buscarTodosClientes() : await buscarClienteTermino(term)
        });
    },
    validarTodosClientes: (req, res) => {
        const errorMessage = undefined;
        const response = errorMessage ? { errorMessage } : {};
        res.send(JSON.stringify(response));
    }
}