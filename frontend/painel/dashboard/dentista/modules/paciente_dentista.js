console.log("[Paciente Dentista] 🔥 Script paciente_dentista.js carregado corretamente!");

// Arrays globais
export let pacientesData = [];
export let pedidosPacienteData = [];


async function carregarPacientesDentista() {
  console.log("[Paciente Dentista] 🔄 Iniciando carregamento de pacientes...");

  try {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("❌ Usuário não autenticado! Redirecionando para login.");
      window.location.href = "/login.html";
      return;
    }

    const response = await fetch("http://localhost:5000/dentista/pacientes/dashboard", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    if (!response.ok) throw new Error(`❌ Erro ao carregar pacientes. Status: ${response.status}`);

    // 🔹 Captura os headers recebidos
    const headers = response.headers;
    const dentista = {
      id: headers.get("X-Dentista-ID") || "--",
      nome: headers.get("X-Dentista-Nome") || "Desconhecido",
      sexo: headers.get("X-Dentista-Sexo") || "M"
    };

    console.log("✅ Dados do Dentista:", dentista);

    // 🔹 Define o prefixo "Dr." ou "Dra."
    const prefixo = dentista.sexo === "F" ? "Dra." : "Dr.";

    // 🔹 Atualiza os elementos do HTML (verifica se existem antes)
    const dentistaNomeEl = document.getElementById("dentista-nome");
    const dentistaIdEl = document.getElementById("dentista-id");

    if (dentistaNomeEl) {
      dentistaNomeEl.textContent = `${prefixo} ${dentista.nome}`;
      console.log(`📝 Atualizando nome do dentista para: ${prefixo} ${dentista.nome}`);
    } else {
      console.warn("⚠️ Elemento #dentista-nome não encontrado!");
    }

    if (dentistaIdEl) {
      dentistaIdEl.textContent = `(ID: ${dentista.id})`;
    } else {
      console.warn("⚠️ Elemento #dentista-id não encontrado!");
    }

    // 🔹 Captura os pacientes e atualiza a tabela
    const dadosRecebidos = await response.json();
    pacientesData = [...new Map(dadosRecebidos.map(p => [p.id, p])).values()];

    console.log("✅ Pacientes carregados:", pacientesData);
    atualizarDropdownPacientes();

  } catch (error) {
    console.error("❌ Erro ao carregar pacientes:", error);
  }
}

function criarTabelaPacientes() {
  const tabela = document.getElementById("tabela-pacientes");
  const thead = tabela.querySelector("thead");
  const tbody = tabela.querySelector("tbody");
  const selectPacienteAtivo = document.getElementById("paciente-ativo");

  // Limpa conteúdo anterior
  thead.innerHTML = "";
  tbody.innerHTML = "";

  // Cabeçalho dinâmico
  thead.innerHTML = `
    <tr>
      <th>Nome</th>
      <th>Data de Nascimento</th>
      <th>Sexo</th>
      <th>Pedidos em Aberto</th>
      <th>Ações</th>
    </tr>`;

  // Se não houver pacientes
  if (!pacientesData.length) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;">Nenhum paciente encontrado.</td></tr>`;
    return;
  }

  // Preenche a tabela
  pacientesData.forEach(paciente => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${paciente.nome} (ID: ${paciente.id})</td>
      <td>${paciente.data_nascimento || "--"}</td>
      <td>${paciente.sexo || "--"}</td>
      <td>${paciente.pedidos_abertos ?? 0}</td>
      <td><button class="btn-ver" data-id="${paciente.id}">Ver</button></td>
    `;
    tbody.appendChild(row);
  });

  // Adiciona eventos aos botões "Ver"
  document.querySelectorAll(".btn-ver").forEach(btn =>
    btn.addEventListener("click", () => {
      const pacienteId = btn.getAttribute("data-id");

    

      preencherResumoPaciente(pacienteId);
      carregarPedidosPaciente(pacienteId);
    })
  );
}

function atualizarDropdownPacientes() {
  console.log("[Paciente Dentista] 🔄 Atualizando dropdown de pacientes...");

  const selectPacienteAtivo = document.getElementById("paciente-ativo");
  if (!selectPacienteAtivo) {
    console.warn("⚠️ Dropdown #paciente-ativo não encontrado!");
    return;
  }

  selectPacienteAtivo.innerHTML = `<option value="">Escolha...</option>` + 
    pacientesData.map(p => `<option value="${p.id}">${p.nome}</option>`).join("");

  selectPacienteAtivo.addEventListener("change", () => {
    const pacienteId = selectPacienteAtivo.value;
    if (pacienteId) {
      preencherResumoPaciente(pacienteId);
      carregarPedidosPaciente(pacienteId);
    }
  });
}

async function preencherResumoPaciente(pacienteId) {
  console.log(`🔄 Atualizando resumo do paciente ID: ${pacienteId}`);

  try {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("❌ Usuário não autenticado! Redirecionando para login.");
      window.location.href = "/login.html";
      return;
    }

    const response = await fetch(`http://localhost:5000/dentista/pacientes/${pacienteId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    if (!response.ok) throw new Error(`❌ Erro ao carregar detalhes do paciente. Status: ${response.status}`);

    const data = await response.json();
    console.log("✅ Dados do paciente recebidos:", data);

    if (!data.paciente) {
      console.warn("⚠️ Nenhum paciente encontrado para este ID.");
      return;
    }

    // 🔹 Atualiza os elementos do HTML corretamente
    document.getElementById("nome-paciente-selecionado").textContent = data.paciente.nome || "Desconhecido";
    document.getElementById("contato-paciente").textContent = data.paciente.telefone || "---";
    document.getElementById("data-paciente").textContent = data.paciente.data_nascimento || "--";
    document.getElementById("sexo-paciente").textContent = data.paciente.sexo || "--";

    // 🔹 Atualiza pedidos na tabela
    atualizarTabelaPedidosPaciente(data.pedidos);

    // 🔹 Atualiza o dropdown para refletir o paciente selecionado
    const selectPacienteAtivo = document.getElementById("paciente-ativo");
    if (selectPacienteAtivo) {
      selectPacienteAtivo.value = pacienteId;
    }

    // 🔹 Faz o scroll automático para a seção do resumo do paciente
    const infoPacienteSection = document.getElementById("info-dentista");
    if (infoPacienteSection) {
      infoPacienteSection.scrollIntoView({ behavior: "smooth" });
      console.log("📜 Rolando para o resumo do paciente...");
    }

  } catch (error) {
    console.error("❌ Erro ao buscar detalhes do paciente:", error);
  }
}



async function carregarPedidosPaciente(pacienteId) {
  console.log(`🔄 Buscando pedidos do paciente ID: ${pacienteId}...`);

  const token = localStorage.getItem("token");
  if (!token) {
    console.error("❌ Usuário não autenticado! Redirecionando para login.");
    window.location.href = "/login.html";
    return;
  }

  try {
    const response = await fetch(`http://localhost:5000/dentista/pacientes/${pacienteId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    if (!response.ok) throw new Error(`❌ Erro ao carregar pedidos do paciente. Status: ${response.status}`);

    const data = await response.json();
    console.log(`✅ Pedidos recebidos para o paciente ${pacienteId}:`, data.pedidos);

    atualizarTabelaPedidosPaciente(data.pedidos); // 🔥 Renderiza corretamente os pedidos do paciente

  } catch (error) {
    console.error("❌ Erro ao carregar pedidos do paciente:", error);
    atualizarTabelaPedidosPaciente([]);
  }
}

function atualizarTabelaPedidosPaciente(pedidos = []) {
  console.log("[Paciente Dentista] 🔄 Atualizando tabela de pedidos do paciente...");

  const tabelaPedidos = document.getElementById("tabela-pedidos-paciente").querySelector("tbody");
  if (!tabelaPedidos) {
    console.warn("⚠️ Elemento #tabela-pedidos-paciente não encontrado!");
    return;
  }

  tabelaPedidos.innerHTML = pedidos.length
    ? pedidos.map(pedido => `
      <tr>
        <td>${pedido.id}</td>
        <td><button class="btn-detalhes" data-ficha='${JSON.stringify(pedido.ficha_tecnica)}'>Ver Detalhes</button></td>
        <td>${pedido.arquivo_3d ? `<a href="${pedido.arquivo_3d}" target="_blank">Link</a>` : "Sem arquivo"}</td>
        <td>${pedido.status || "Indefinido"}</td>
      </tr>`).join("")
    : `<tr><td colspan="4" style="text-align:center;">Nenhum pedido encontrado.</td></tr>`;

  console.log("[Paciente Dentista] ✅ Tabela de pedidos do paciente atualizada!");

  // 🔹 Adiciona evento para abrir detalhes da ficha técnica
  document.querySelectorAll(".btn-detalhes").forEach(btn => {
    btn.addEventListener("click", () => {
      const fichaTecnica = JSON.parse(btn.getAttribute("data-ficha"));
      alert(`📋 Detalhes da Ficha Técnica:\n${JSON.stringify(fichaTecnica, null, 2)}`);
    });
  });
}

carregarPacientesDentista().then(() => criarTabelaPacientes());
window.preencherResumoPaciente = preencherResumoPaciente;
