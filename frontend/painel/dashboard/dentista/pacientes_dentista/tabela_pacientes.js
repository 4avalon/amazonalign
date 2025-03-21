import { initSortAndFilters } from "../../core/sortAndFilter.js";
import { carregarPedidosPaciente } from "../pacientes_dentista/tabela_pedidos_paciente.js";

// Inicializa tabela ao carregar
export function inicializarTabelaPacientes() {
  const containerPacientes = document.getElementById("lista-pacientes");

  if (!containerPacientes) {
    console.warn("⚠️ Container #lista-pacientes não encontrado!");
    return;
  }

  containerPacientes.innerHTML = `
    <table id="tabela-pacientes-dentista" class="tabela">
      <thead>
        <tr>
          <th>Nome <button class="sort-btn" data-column="nome">⇅</button></th>
          <th>Data de Nascimento <button class="sort-btn" data-column="data_nascimento">⇅</button></th>
          <th>Sexo <button class="sort-btn" data-column="sexo">⇅</button></th>
          <th>Pedidos em Aberto <button class="sort-btn" data-column="pedidos_abertos">⇅</button></th>
          <th>Ações</th>
        </tr>
        <tr>
          <td><input type="text" id="filtro-nome" placeholder="Filtrar Nome"></td>
          <td><input type="date" id="filtro-data_nascimento"></td>
          <td>
            <select id="filtro-sexo">
              <option value="">Todos</option>
              <option value="M">M</option>
              <option value="F">F</option>
            </select>
          </td>
          <td>--</td>
          <td>--</td>
        </tr>
      </thead>
      <tbody id="tbody-pacientes">
        <tr><td colspan="5" style="text-align:center;">Carregando pacientes...</td></tr>
      </tbody>
    </table>
  `;

  // Inicializa os filtros e ordenação
  initSortAndFilters("tabela-pacientes-dentista", carregarPacientesDentista);

  // Carrega inicialmente os pacientes
  carregarPacientesDentista();
}

// Carregar pacientes da API
export async function carregarPacientesDentista({ ordenacao = {}, filtros = {} } = {}) {
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

  const url = `http://localhost:5000/dentista/pacientes/dashboard?${params.toString()}`;

  try {
    console.log(`🔍 Buscando pacientes na API: ${url}`);
    
    const response = await fetch(url, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) throw new Error(`Erro HTTP ${response.status}`);

    const pacientes = await response.json();
    console.log("📌 Resposta da API:", pacientes);

    if (!Array.isArray(pacientes)) {
      throw new Error("Os dados recebidos não são uma lista válida!");
    }

    renderListaPacientesDentista(pacientes);
  } catch (error) {
    console.error("❌ Erro ao carregar pacientes:", error);
    exibirErroNaTabela("Erro ao carregar pacientes.");
  }
}

// Renderizar tabela com pacientes
function renderListaPacientesDentista(pacientes) {
  const tbody = document.getElementById("tbody-pacientes");
  if (!tbody) return;

  tbody.innerHTML = pacientes.length
    ? pacientes.map(paciente => `
      <tr>
        <td>${paciente.nome} (ID: ${paciente.id})</td>
        <td>${paciente.data_nascimento || "--"}</td>
        <td>${paciente.sexo || "--"}</td>
        <td>${paciente.pedidos_abertos ?? 0}</td>
        <td><button class="btn-ver" data-id="${paciente.id}">👁 Ver</button></td>
      </tr>`).join("")
    : `<tr><td colspan="5" style="text-align:center;">Nenhum paciente encontrado.</td></tr>`;

  // Evento botão "Ver"
  document.querySelectorAll(".btn-ver").forEach(btn =>
    btn.onclick = () => verDetalhesPacienteDentista(btn.getAttribute("data-id")));
}

// Exibir mensagem de erro
function exibirErroNaTabela(mensagem) {
  const tbody = document.getElementById("tbody-pacientes");
  if (tbody) tbody.innerHTML = `<tr><td colspan="5" style="color: red; text-align: center;">${mensagem}</td></tr>`;
}

// Evento botão "Ver"

// Evento botão "Ver"
document.querySelectorAll(".btn-ver").forEach(btn =>
  btn.onclick = () => verDetalhesPacienteDentista(btn.getAttribute("data-id"))
);

// Função que busca os detalhes do paciente diretamente pelo ID (Tabela 3)
async function verDetalhesPacienteDentista(pacienteId) {
  console.log(`🔎 Ver detalhes do paciente ID: ${pacienteId}`);

  const selectPaciente = document.getElementById("paciente-ativo");
  if (!selectPaciente) {
    console.warn("⚠️ Dropdown de pacientes não encontrado!");
    return;
  }

  // Seleciona o paciente no dropdown
  selectPaciente.value = pacienteId;
  selectPaciente.dispatchEvent(new Event("change")); // Atualiza detalhes e pedidos automaticamente

  // Carrega os pedidos do paciente selecionado
  await carregarPedidosPaciente(pacienteId);

  // Scroll até os detalhes do paciente
  document.getElementById("info-dentista").scrollIntoView({ behavior: "smooth" });
}

