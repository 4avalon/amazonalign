const { listarPacientesDashboard, obterDetalhesPaciente } = require("./dentista/dentistaPacienteController");
const { listarPedidosDentista } = require("./dentista/dentistaPedidoController");

module.exports = {
  listarPacientesDashboard,
  obterDetalhesPaciente,
  listarPedidosDentista
};
