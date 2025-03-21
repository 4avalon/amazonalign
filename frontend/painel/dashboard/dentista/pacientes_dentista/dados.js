console.log("[Paciente Dentista] 🔥 Módulo dados.js carregado!");

// 🔹 Armazena dados globalmente (para reutilização)
export let pacientesData = [];

export async function carregarPacientes() {
  console.log("[Paciente Dentista] 🔄 Buscando lista de pacientes...");

  try {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("❌ Usuário não autenticado! Redirecionando...");
      window.location.href = "/login.html";
      return [];
    }

    const response = await fetch("http://localhost:5000/dentista/pacientes/dashboard", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) throw new Error(`Erro HTTP ${response.status}`);

    const pacientes = await response.json();
    if (!Array.isArray(pacientes)) throw new Error("Os dados recebidos não são uma lista válida!");

    console.log("📌 Pacientes carregados:", pacientes);
    pacientesData = pacientes; // Atualiza a variável global

    return pacientes;
  } catch (error) {
    console.error("❌ Erro ao carregar pacientes:", error);
    return [];
  }
}

/**
 * 🔎 Carrega os detalhes de um paciente específico
 * @param {number} pacienteId - ID do paciente
 * @returns {Promise<Object>} Dados do paciente + pedidos
 */

export async function carregarDetalhesPaciente(pacienteId) {
  console.log(`📦 Buscando detalhes do paciente ID: ${pacienteId}...`);

  try {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("❌ Usuário não autenticado! Redirecionando...");
      window.location.href = "/login.html";
      return null;
    }

    const response = await fetch(`http://localhost:5000/dentista/pacientes/${pacienteId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) throw new Error(`Erro HTTP ${response.status}`);

    const data = await response.json();
    if (!data.paciente) {
      console.warn("⚠️ Paciente não encontrado!");
      return null;
    }

    console.log(`📋 Detalhes do paciente ${pacienteId}:`, data);
    return data; // Retorna { paciente, pedidos }
  } catch (error) {
    console.error("❌ Erro ao buscar detalhes do paciente:", error);
    return null;
  }
}
