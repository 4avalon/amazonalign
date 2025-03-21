console.log("[Pedidos Dentista] 🔥 Script pedidos_dentista.js carregado corretamente!");

import { initSortAndFilters } from "../core/sortAndFilter.js";
import { carregarDetalhesPaciente } from "./pacientes_dentista/dados.js";
import { atualizarDadosPaciente } from "./pacientes_dentista/detalhes_paciente.js";
import { carregarPedidosPaciente } from "./pacientes_dentista/tabela_pedidos_paciente.js";

function inicializarTabelaPedidosDentista() {
  const containerPedidos = document.getElementById("pedidos-dentista");

  if (!containerPedidos) {
    console.warn("⚠️ Container #pedidos-dentista não encontrado!");
    return;
  }

  containerPedidos.innerHTML = `
    <table id="tabela-pedidos-dentista" class="tabela">
      <thead>
        <tr>
          <th>ID Pedido <button class="sort-btn" data-column="id">⇅</button></th>
          <th>Paciente <button class="sort-btn" data-column="paciente_nome">⇅</button></th>
          <th>Data do Pedido <button class="sort-btn" data-column="data_pagamento">⇅</button></th>
          <th>Status <button class="sort-btn" data-column="status">⇅</button></th>
          <th>Ficha Técnica</th>
          <th>Arquivo 3D</th>
          <th>Ações</th>
        </tr>
        <tr>
          <td><input type="text" id="filtro-id" placeholder="Filtrar ID"></td>
          <td><input type="text" id="filtro-paciente_nome" placeholder="Filtrar Paciente"></td>
          <td>--</td>
          <td>
            <select id="filtro-status">
              <option value="">Todos</option>
              <option value="aberto">Aberto</option>
              <option value="pago">Pago</option>
              <option value="finalizado">Finalizado</option>
              <option value="cancelado">Cancelado</option>
            </select>
          </td>
          <td>--</td>
          <td>--</td>
          <td>--</td>
        </tr>
      </thead>
      <tbody id="tbody-pedidos">
        <tr><td colspan="7" style="text-align:center;">Carregando pedidos...</td></tr>
      </tbody>
    </table>
  `;

  initSortAndFilters("tabela-pedidos-dentista", carregarPedidosDentista);
}

async function carregarPedidosDentista({ ordenacao = {}, filtros = {} } = {}) {
  const token = localStorage.getItem("token");
  if (!token) return (window.location.href = "/login.html");

  const params = new URLSearchParams();
  if (ordenacao.coluna) {
    params.append("coluna", ordenacao.coluna);
    params.append("ordem", ordenacao.ordem);
  }
  Object.entries(filtros).forEach(([chave, valor]) => {
    if (valor) params.append(chave, valor);
  });

  const url = `http://localhost:5000/dentista/pedidos/dashboard?${params.toString()}`;

  try {
    console.log(`🔍 Buscando pedidos na API: ${url}`);
    
    const response = await fetch(url, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) throw new Error(`Erro HTTP ${response.status}`);

    const pedidos = await response.json();
    console.log("📌 Resposta da API:", pedidos);

    if (!Array.isArray(pedidos)) {
      throw new Error("Os dados recebidos não são uma lista válida!");
    }

    renderListaPedidosDentista(pedidos);
  } catch (error) {
    console.error("❌ Erro ao carregar pedidos:", error);
    exibirErroNaTabela("Erro ao carregar pedidos.");
  }
}

function renderListaPedidosDentista(pedidos) {
  const tbody = document.getElementById("tbody-pedidos");
  if (!tbody) return;

  tbody.innerHTML = pedidos.length
    ? pedidos.map(pedido => `
      <tr>
        <td>${pedido.id}</td>
        <td>${pedido.paciente_nome || "N/D"}</td>
        <td>${pedido.data_pagamento || "--"}</td>
        <td>${pedido.status || "Indefinido"}</td>
        <td><button class="btn-detalhes" data-id="${pedido.id}">📄 Detalhes</button></td>
        <td>${pedido.arquivo_3d ? `<a href="${pedido.arquivo_3d}" target="_blank">📂 Ver Arquivo</a>` : "Sem arquivo"}</td>
        <td>
          <button class="btn-ver-detalhes" data-pedido-id="${pedido.id}" data-paciente-id="${pedido.paciente_id}">
            👁 Ver
          </button>
        </td>

      </tr>`).join("")
    : `<tr><td colspan="7" style="text-align:center;">Nenhum pedido encontrado.</td></tr>`;

  document.querySelectorAll(".btn-detalhes").forEach(btn =>
    btn.onclick = () => abrirFichaTecnica(btn.getAttribute("data-id")));

  document.querySelectorAll(".btn-ver-detalhes").forEach(btn =>
    btn.onclick = () => verDetalhesPacientePorId(btn.getAttribute("data-paciente-id")));
}

function exibirErroNaTabela(mensagem) {
  const tbody = document.getElementById("tbody-pedidos");
  if (tbody) tbody.innerHTML = `<tr><td colspan="7" style="color: red; text-align: center;">${mensagem}</td></tr>`;
}

function abrirFichaTecnica(pedidoId) {
  console.log(`📑 Abrindo ficha técnica do pedido ID: ${pedidoId}`);
  alert(`Funcionalidade para abrir ficha técnica do pedido #${pedidoId} ainda não implementada.`);
}

// Agora cria corretamente essa função 👇
async function verDetalhesPacientePorId(pacienteId) {
  console.log(`🔎 Buscando detalhes do paciente ID: ${pacienteId}`);

  const selectPaciente = document.getElementById("paciente-ativo");
  if (!selectPaciente) {
    console.warn("⚠️ Dropdown não encontrado!");
    return;
  }

  // Define o dropdown para o paciente clicado
  selectPaciente.value = pacienteId;
  selectPaciente.dispatchEvent(new Event("change"));

  // Carrega os pedidos específicos desse paciente
  await carregarPedidosPaciente(pacienteId);

  // Scroll para seção correta
  document.getElementById("info-dentista").scrollIntoView({ behavior: "smooth" });
}



inicializarTabelaPedidosDentista();
carregarPedidosDentista();
