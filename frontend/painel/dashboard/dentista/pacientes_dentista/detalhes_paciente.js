import { carregarPedidosPaciente } from "./tabela_pedidos_paciente.js";
import { BASE_URL } from "../../../config.js"; // ajuste se necessário

// Configura o dropdown e os detalhes do paciente
export async function configurarDetalhesPaciente() {
  //console.log("🔄 Configurando detalhes do paciente...");

  const selectPaciente = document.getElementById("paciente-ativo");
  if (!selectPaciente) {
    console.warn("⚠️ Dropdown #paciente-ativo não encontrado!");
    return;
  }

  try {
    const token = localStorage.getItem("token");
    if (!token) return (window.location.href = "/login.html");

    // Buscar pacientes disponíveis
    const response = await fetch(`${BASE_URL}/dentista/pacientes/dashboard`, {

      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) throw new Error(`Erro HTTP ${response.status}`);

    const pacientes = await response.json();
    //console.log("📌 Lista de pacientes carregada:", pacientes);

    if (!Array.isArray(pacientes) || pacientes.length === 0) {
      throw new Error("Nenhum paciente disponível!");
    }

    // Preencher o dropdown com os pacientes
    selectPaciente.innerHTML = pacientes
      .map((p, index) => `<option value="${p.id}" ${index === 0 ? "selected" : ""}>${p.nome}</option>`)
      .join("");

    // Seleciona automaticamente o primeiro paciente e preenche os detalhes
    const primeiroPaciente = pacientes[0];
    atualizarDadosPaciente(primeiroPaciente);
    localStorage.setItem("paciente_id", primeiroPaciente.id);
    //console.log("🧠 paciente_id inicial salvo no localStorage:", primeiroPaciente.id);

    // Evento de troca de paciente no dropdown
    // Evento de troca de paciente no dropdown
    selectPaciente.onchange = () => {
      const pacienteSelecionado = pacientes.find(p => p.id == selectPaciente.value);
      if (pacienteSelecionado) {
        atualizarDadosPaciente(pacienteSelecionado);

        // 🔥 Adiciona esta linha:
        localStorage.setItem("paciente_id", pacienteSelecionado.id);
        //console.log("🧠 paciente_id salvo no localStorage:", pacienteSelecionado.id);
      }
    };

  } catch (error) {
    console.error("❌ Erro ao carregar pacientes:", error);
  }
}

// Atualiza os detalhes do paciente e a tabela de pedidos
export function atualizarDadosPaciente(paciente) {
  //console.log(`📝 Atualizando para paciente: ${paciente.nome} (ID: ${paciente.id})`);
  document.querySelectorAll(".nome-paciente-selecionado").forEach(el => {
    el.textContent = paciente.nome || "---";
  });

  //document.getElementById("nome-paciente-selecionado2").textContent = paciente.nome || "---";
  document.getElementById("contato-paciente").textContent = paciente.telefone || "---";
  document.getElementById("data-paciente").textContent = paciente.data_nascimento || "--";
  document.getElementById("sexo-paciente").textContent = paciente.sexo || "--";

  // Atualizar a tabela de pedidos para o paciente selecionado
  carregarPedidosPaciente(paciente.id);
}
export function carregarDadosDentista() {
  //console.log("🔄 Buscando dados do dentista via Token JWT...");

  const dentistaNome = document.getElementById("dentista-nome");
  const dentistaId = document.getElementById("dentista-id");

  if (!dentistaNome || !dentistaId) {
    console.warn("⚠️ Elementos do nome do dentista não encontrados!");
    return;
  }

  const token = localStorage.getItem("token");

  if (!token) {
    console.error("❌ Nenhum token encontrado!");
    window.location.href = "/login.html";
    return;
  }

  try {
    // 🔹 Decodifica o Token JWT
    const tokenParts = token.split(".");
    
    if (tokenParts.length !== 3) {
      throw new Error("Formato inválido de Token JWT");
    }

    const tokenPayload = JSON.parse(atob(tokenParts[1]));
    //console.log("📌 Dados extraídos do Token JWT:", tokenPayload);

    // 🔹 Verifica se os dados necessários existem
    if (!tokenPayload.id || !tokenPayload.nome) {
      throw new Error("Token JWT não contém informações suficientes");
    }

    // 🔹 Atualiza a interface com os dados do dentista
    dentistaNome.textContent = tokenPayload.nome;
    dentistaId.textContent = `(ID: ${tokenPayload.id})`;

  } catch (error) {
    console.error("❌ Erro ao extrair dados do Token JWT:", error);
    
    // 🔹 Em caso de erro, exibe valores padrão
    dentistaNome.textContent = "Dentista";
    dentistaId.textContent = "";
  }
}


