const express = require("express");
const bodyParser = require("body-parser");

const { serverconfig } = require("./config.js")
const { todosClientes, validarTodosClientes } = require("./routes/cliente");

Object.defineProperty(Array.prototype, 'flat', {
  value: function (depth = 1) {
    return this.reduce(function (flat, toFlatten) {
      return flat.concat((Array.isArray(toFlatten) && (depth > 1)) ? toFlatten.flat(depth - 1) : toFlatten);
    }, []);
  }
});

const app = express();
const port = process.env.PORT || 3700;

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

serverconfig(app);

app.post("/buscarCliente/acquire", todosClientes);
app.post("/buscarCliente/validate", validarTodosClientes);

app.get("/config", (req, res) => {
  console.log("Petición a configuración")
  res.download("config.json");
});

server.listen(port, () => {
  console.log("i2Connect en puerto " + port);
});
