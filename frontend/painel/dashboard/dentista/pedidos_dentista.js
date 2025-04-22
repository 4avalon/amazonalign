//console.log("[Pedidos Dentista] 🔥 Script pedidos_dentista.js carregado corretamente!");

import { initSortAndFilters } from "../core/sortAndFilter.js";
import { carregarDetalhesPaciente } from "./pacientes_dentista/dados.js";
import { atualizarDadosPaciente } from "./pacientes_dentista/detalhes_paciente.js";
import { carregarPedidosPaciente } from "./pacientes_dentista/tabela_pedidos_paciente.js";
import { preencherFichaTecnicaComJSON } from "./form_dentista/ficha_tecnica_utils.js";
import { BASE_URL } from "../../config.js"; // ajuste o caminho conforme onde estiver seu config.js


function inicializarTabelaPedidosDentista() {
  const containerPedidos = document.getElementById("pedidos-dentista");

  if (!containerPedidos) {
    console.warn("⚠️ Container #pedidos-dentista não encontrado!");
    return;
  }

  containerPedidos.innerHTML = `
    <h1> Tabela 1 tabela-pedidos-dentista</h1>
<div >
  <table id="tabela-pedidos-dentista" class="tabela tabela-scroll">
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
        <td><input type="date" id="filtro-data_pagamento"></td>
        <td>
          <select id="filtro-status">
            <option value="">Todos</option>
            <option value="aberto">Aberto</option>
            <option value="pago">Pago</option>
            <option value="em_producao">Em Produção</option>
            <option value="finalizado">Finalizado</option>
            <option value="entregue">Entregue</option>
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
</div>

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

  const url = `${BASE_URL}/dentista/pedidos/dashboard?${params.toString()}`;

  try {
    //console.log(`🔍 [Pedidos Dentista]Buscando pedidos na API: ${url}`);
    
    const response = await fetch(url, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) throw new Error(`Erro HTTP ${response.status}`);

    const pedidos = await response.json();
    //console.log("📌 Resposta da API:", pedidos);

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

  // Adiciona evento aos botões de detalhes
  document.querySelectorAll(".btn-detalhes").forEach(botao => {
    botao.addEventListener("click", async () => {
      const pedidoId = botao.getAttribute("data-id");
      if (!pedidoId) return;

      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${BASE_URL}/pedidos/${pedidoId}`, { 

          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Erro ao buscar dados do pedido");

        const pedido = await response.json();
        //console.log("📦 [Pedidos Dentista] Pedido completo carregado:", pedido);

        // Aqui você chama a função que preenche o modal e exibe
        abrirModalFichaTecnica(pedido);

      } catch (error) {
        console.error("❌ Erro ao carregar dados do pedido:", error);
        alert("Erro ao abrir detalhes do pedido.");
      }
    });
  });





  document.querySelectorAll(".btn-ver-detalhes").forEach(btn =>
    btn.onclick = () => verDetalhesPacientePorId(btn.getAttribute("data-paciente-id")));
}

function exibirErroNaTabela(mensagem) {
  const tbody = document.getElementById("tbody-pedidos");
  if (tbody) tbody.innerHTML = `<tr><td colspan="7" style="color: red; text-align: center;">${mensagem}</td></tr>`;
}


export async function abrirFichaTecnica(pedidoId) {
  //console.log(`📑[Pedidos Dentista] Buscando dados do pedido #${pedidoId}...`);

  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BASE_URL}/pedidos/${pedidoId}`, { 

      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!response.ok) throw new Error(`Erro ao buscar pedido: ${response.status}`);

    const pedido = await response.json();
    //console.log("📦[Pedidos Dentista] Pedido recebido:", pedido);

    abrirModalFichaTecnica(pedido); // Chama o modal com os dados

  } catch (error) {
    console.error("❌ Erro ao buscar pedido:", error);
    alert("Erro ao carregar os dados do pedido.");
  }
}


export function abrirModalFichaTecnica(pedido) {
  const modal = document.getElementById("modal-ficha-tecnica");
  const overlay = document.getElementById("modal-overlay");

  modal.style.display = "block";
  overlay.style.display = "block";

  document.getElementById("resumo-pedido").innerHTML = `
    <p>Dentista: ${pedido.dentista_nome || "--"}</p>
    <p>Paciente: ${pedido.paciente_nome || "--"}</p>
    <p>ID Pedido: ${pedido.id}</p>
    <p>Status: ${pedido.status}</p>
    <p>Data: ${new Date(pedido.created_at).toLocaleDateString()}</p>
  `;

  fetch("dashboard/dentista/form_dentista/ficha_tecnica.html")
    .then(res => res.text())
    .then(async html => {
      document.getElementById("container-ficha-tecnica").innerHTML = html;

      // Carregar APENAS o JS necessário que ainda não foi importado
      await carregarScriptDinamico("dashboard/dentista/form_dentista/ficha_tecnica.js");

      setTimeout(() => {
        // Usa diretamente a função importada
        preencherFichaTecnicaComJSON(pedido.ficha_tecnica);

        const podeEditar = ["aberto", "pago"].includes(pedido.status);
        document.querySelectorAll('#container-ficha-tecnica input, #container-ficha-tecnica select, #container-ficha-tecnica textarea')
          .forEach(el => el.disabled = !podeEditar);

        document.getElementById("btn-excluir-pedido").style.display = pedido.status === "aberto" ? "inline-block" : "none";
        document.getElementById("btn-salvar-edicao").style.display = podeEditar ? "inline-block" : "none";

                // ⬇️ Adiciona eventos aos botões do modal
        document.getElementById("btn-excluir-pedido").onclick = () => excluirPedido(pedido.id);
        document.getElementById("btn-salvar-edicao").onclick = () => atualizarFichaTecnica(pedido.id);


      }, 150);
    });
}


async function excluirPedido(pedidoId) {
  if (!confirm("Tem certeza que deseja excluir este pedido?")) return;

  try {
    const response = await fetch(`${BASE_URL}/pedidos/${pedidoId}`, { 

      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    });

    const result = await response.json();
    if (response.ok) {
      alert("✅ Pedido excluído com sucesso!");
      document.getElementById("modal-ficha-tecnica").style.display = "none";
      document.getElementById("modal-overlay").style.display = "none";
      carregarPedidosDentista(); // Recarrega a tabela
    } else {
      alert(`❌ Erro ao excluir: ${result.message}`);
    }
  } catch (err) {
    console.error("❌ Erro ao excluir pedido:", err);
    alert("Erro ao excluir pedido.");
  }
}

async function atualizarFichaTecnica(pedidoId) {
  const fichaTecnica = window.fichaTecnicaUtils.capturarFichaTecnicaComoJSON();

  try {
    const response = await fetch(`${BASE_URL}/pedidos/${pedidoId}`, { 

      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({ ficha_tecnica: fichaTecnica })
    });

    const result = await response.json();
    if (response.ok) {
      alert("✅ Ficha Técnica atualizada com sucesso!");
    } else {
      alert(`❌ Erro ao atualizar: ${result.message}`);
    }
  } catch (err) {
    console.error("❌ Erro ao atualizar ficha técnica:", err);
    alert("Erro ao atualizar ficha técnica.");
  }
}


// Agora cria corretamente essa função 👇
async function verDetalhesPacientePorId(pacienteId) {
  //console.log(`🔎 Buscando detalhes do paciente ID: ${pacienteId}`);

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
  const alvo = document.getElementById("info-dentista");
  const offset = -100; // Ajuste como quiser
  const y = alvo.getBoundingClientRect().top + window.scrollY + offset;
  window.scrollTo({ top: y, behavior: "smooth" });

}



inicializarTabelaPedidosDentista();
carregarPedidosDentista();
