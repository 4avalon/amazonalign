import { initSortAndFilters } from "../../core/sortAndFilter.js";
import { abrirFichaTecnica } from "../pedidos_dentista.js";
import { BASE_URL } from "../../../config.js"; // ajuste se necessário

// Inicializa a tabela sem definir um paciente fixo
export function inicializarTabelaPedidosPaciente() {
  const containerPedidos = document.getElementById("tabela-pedidos-paciente");

  if (!containerPedidos) {
    console.warn("⚠️ Container #resumo-paciente não encontrado!");
    return;
  }

containerPedidos.innerHTML = `
      <h1> Tabela 2 tabela-pedidos-paciente</h1>
<div class="tabela-wrapper">
  <table id="tabela-pedidos-paciente" class="tabela">
    <thead>
      <tr>
        <th>ID Pedido <button class="sort-btn" data-column="id">⇅</button></th>
        <th>Ficha Técnica</th>
        <th>Arquivo 3D</th>
        <th>Status <button class="sort-btn" data-column="status">⇅</button></th>
      </tr>
      <tr>
        <td><input type="text" id="filtro-id" placeholder="Filtrar ID"></td>
        <td>--</td>
        <td>--</td>
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
      </tr>
    </thead>
  </table>

  <div class="tabela-scroll">
    <table class="tabela">
      <tbody id="tbody-pedidos-paciente">
        <tr>
          <td colspan="4" style="text-align:center;">Carregando pedidos do paciente...</td></tr>
      </tbody>
    </table>
  </div>
</div>

`;



  // Inicializa a ordenação e filtros (ID será definido pelo dropdown)
  initSortAndFilters("tabela-pedidos-paciente", (ordenacao, filtros) => {
    const pacienteId = document.getElementById("paciente-ativo")?.value;
    if (pacienteId) {
      carregarPedidosPaciente(pacienteId, ordenacao, filtros);
    }
  });
}

// Função para carregar pedidos da API
export async function carregarPedidosPaciente(pacienteId, { ordenacao = {}, filtros = {} } = {}) {
  const token = localStorage.getItem("token");
  if (!token) return (window.location.href = "/login.html");

  if (!pacienteId) {
    console.warn("⚠️ Nenhum paciente selecionado. Abortando carregamento.");
    return;
  }

  const params = new URLSearchParams();
  params.append("coluna", ordenacao.coluna || "id");
  params.append("ordem", ordenacao.ordem || "desc"); // Padrão DESC

  Object.entries(filtros).forEach(([chave, valor]) => {
    if (valor) params.append(chave, valor);
  });

  const url = `${BASE_URL}/dentista/pacientes/${pacienteId}?${params.toString()}`;


  try {
    //console.log(`📡 Buscando pedidos do paciente ${pacienteId} na API: ${url}`);
    
    const response = await fetch(url, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) throw new Error(`Erro HTTP ${response.status}`);

    const data = await response.json();
    //console.log("📦 Dados recebidos da API:", data);

    if (!data.paciente || !Array.isArray(data.pedidos)) {
      throw new Error("Resposta da API inválida!");
    }

    // 🟢 Agora renderiza os pedidos corretamente
    renderizarPedidosPaciente(data.pedidos);

  } catch (error) {
    console.error("❌ Erro ao carregar pedidos do paciente:", error);
  }
}
// Renderiza os pedidos do paciente na tabela
function renderizarPedidosPaciente(pedidos) {
  const tbody = document.getElementById("tbody-pedidos-paciente");
  if (!tbody) return;

  tbody.innerHTML = pedidos.length
    ? pedidos.map(pedido => `
      <tr>
        <td>${pedido.id}</td>
        <td>
           <button class="btn-detalhes" data-id="${pedido.id}">
             📄 Detalhes
           </button>
        </td>
        <td>${pedido.arquivo_3d ? `<a href="${pedido.arquivo_3d}" target="_blank">📂 Ver Arquivo</a>` : "--"}</td>
        <td>${pedido.status}</td>
      </tr>`).join("")
    : `<tr><td colspan="4" style="text-align:center;">Nenhum pedido encontrado.</td></tr>`;

  //console.log("✅ Tabela de pedidos do paciente atualizada.");
    // 🔹 Adiciona evento aos botões de "Detalhes" da Ficha Técnica
  // 🔹 Adiciona evento de click aos botões detalhes
  document.querySelectorAll(".btn-detalhes").forEach(botao => {
    const pedidoId = botao.getAttribute("data-id");
    if (pedidoId) {
      botao.onclick = () => abrirFichaTecnica(pedidoId);
    }
  });

}


// Função para controlar exibição do modal
function exibirModal(exibir) {
  const modal = document.getElementById("modal-ficha-tecnica");
  modal.style.display = exibir ? "flex" : "none";
}

// Evento de fechar o modal
const modalClose = document.querySelector("#modal-ficha-tecnica .close");
if (modalClose) {
  modalClose.onclick = () => {
    document.getElementById("modal-ficha-tecnica").style.display = "none";
    document.getElementById("modal-overlay").style.display = "none";
  };
}



// Habilitar/Desabilitar edição
function habilitarEdicaoFichaTecnica(permitirEdicao) {
  document.querySelectorAll("#conteudo-ficha-tecnica-modal input, #conteudo-ficha-tecnica-modal textarea, #conteudo-ficha-tecnica-modal select")
    .forEach(input => input.disabled = !permitirEdicao);
}

// Carregar scripts dinamicamente (se ainda não existir essa função, adicione-a globalmente em `painel.js`)
function carregarScriptDinamico(scriptPath) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${scriptPath}"]`)) return resolve();

    const script = document.createElement("script");
    script.src = scriptPath;
    script.onload = resolve;
    script.onerror = reject;
    document.body.appendChild(script);
  });
}
