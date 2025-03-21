// routes/dashboardDentistaRoutes.js
const express = require("express");
const { 
  listarPacientesDashboard,
  listarPedidosDentista,
  obterDetalhesPaciente
} = require("../controllers/dashboardDentistaController");
const { autenticarToken, autenticarDentista } = require("../middlewares/auth");

const router = express.Router();

// 📌 1️⃣ Listar pacientes vinculados ao dentista logado
router.get("/pacientes/dashboard", autenticarToken, autenticarDentista, listarPacientesDashboard);

// 📌 2️⃣ Listar pedidos do dentista logado
router.get("/pedidos/dashboard", autenticarToken, autenticarDentista, listarPedidosDentista);

// 📌 3️⃣ Obter detalhes de um paciente específico (do dentista logado)
router.get("/pacientes/:id", autenticarToken, autenticarDentista, obterDetalhesPaciente);

module.exports = router;
