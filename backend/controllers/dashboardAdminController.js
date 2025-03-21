// controllers/dashboardAdminController.js
const {
  listarDentistasDashboard,
  obterDetalhesDentista,
  alternarAdmin,
  alternarCredenciado
} = require("./admin/adminDentistaController");

const {
  listarPedidosDashboard,
  alterarStatusPedido
} = require("./admin/adminPedidoController");

const {
  obterEstatisticasAdmin
} = require("./admin/adminEstatisticasController");

// Reexporta tudo em um só objeto
module.exports = {
  listarDentistasDashboard,
  obterDetalhesDentista,
  listarPedidosDashboard,
  alterarStatusPedido,
  obterEstatisticasAdmin,
  alternarAdmin,
  alternarCredenciado
};
