console.log("[Pedidos Dentista] 🔥 Script pedidos_dentista.js carregado corretamente!");

// Array global para armazenar os pedidos do backend
export let pedidosData = [];

async function carregarPedidosDentista() {
  console.log("[Pedidos Dentista] 🔄 Iniciando carregamento de pedidos...");

  try {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("❌ Usuário não autenticado! Redirecionando para login.");
      window.location.href = "/login.html";
      return;
    }

    console.log("🌍 Enviando requisição para /dentista/pedidos/dashboard...");
    const response = await fetch("http://localhost:5000/dentista/pedidos/dashboard", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`❌ Erro ao carregar pedidos. Status: ${response.status}`);
    }

    // Converte a resposta em JSON
    const dadosRecebidos = await response.json();

    if (!Array.isArray(dadosRecebidos)) {
      console.error("❌ O backend não retornou um array de pedidos! Resposta recebida:", dadosRecebidos);
      return;
    }

    pedidosData = dadosRecebidos;
    console.log("✅ Pedidos carregados:", pedidosData);

    atualizarTabelaPedidos();
  } catch (error) {
    console.error("❌ Erro ao carregar pedidos do dentista:", error);
    exibirErroNaTabela("Erro ao carregar pedidos.");
  }
}
function atualizarTabelaPedidos() {
  console.log("[Pedidos Dentista] 🔄 Substituindo toda a tabela...");

  const containerPedidos = document.getElementById("pedidos-dentista");
  if (!containerPedidos) {
    console.warn("⚠️ Seção #pedidos-dentista não encontrada!");
    return;
  }

  // 🔥 Remove a tabela antiga, se existir
  const tabelaAntiga = document.getElementById("tabela-pedidos-dentista");
  if (tabelaAntiga) {
    tabelaAntiga.remove();
  }

  // 🔥 Cria a nova tabela do zero
  const novaTabela = document.createElement("table");
  novaTabela.id = "tabela-pedidos-dentista";
  novaTabela.classList.add("tabela");

  // 🔥 Cria o cabeçalho dinamicamente com os títulos corrigidos
  novaTabela.innerHTML = `
    <thead>
      <tr>
        <th>ID Pedido</th>
        <th>Paciente</th>
        <th>Data do Pedido</th>
        <th>Status</th>
        <th>Ficha Técnica</th> <!-- (Botão Detalhes) -->
        <th>Arquivo 3D</th> <!-- (Link para download) -->
        <th>Ações</th> <!-- (Ver detalhes do pedido) -->
      </tr>
    </thead>
    <tbody id="tbody-pedidos">
      <tr><td colspan="7" style="text-align:center;">Carregando pedidos...</td></tr>
    </tbody>
  `;

  // Adiciona a tabela ao container
  containerPedidos.appendChild(novaTabela);

  const tbody = document.getElementById("tbody-pedidos");

  // 🔥 Verifica se há pedidos
  if (!pedidosData.length) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;">Nenhum pedido encontrado.</td></tr>`;
    return;
  }

  // 🔥 Preenche a tabela com os pedidos
  tbody.innerHTML = "";
  pedidosData.forEach(pedido => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${pedido.id}</td>
      <td>${pedido.paciente_nome || "N/D"}</td>
      <td>${pedido.data_criacao || "--"}</td>
      <td>${pedido.status || "Indefinido"}</td>
      <td>
        <button class="btn-detalhes" data-id="${pedido.id}">📄 Detalhes</button>
      </td>
      <td>
        ${pedido.arquivo_3d ? `<a href="${pedido.arquivo_3d}" target="_blank">📂 Ver Arquivo</a>` : "Sem arquivo"}
      </td>
      <td>
        <button class="btn-ver-detalhes" data-id="${pedido.id}">👁 Ver</button>
      </td>
    `;
    tbody.appendChild(row);
  });

  // Adiciona eventos aos botões "Detalhes" e "Ver"
  document.querySelectorAll(".btn-detalhes").forEach(btn =>
    btn.addEventListener("click", () => {
      const pedidoId = btn.getAttribute("data-id");
      abrirFichaTecnica(pedidoId);
    })
  );

  document.querySelectorAll(".btn-ver-detalhes").forEach(btn =>
    btn.addEventListener("click", () => {
      const pedidoId = btn.getAttribute("data-id");
      verDetalhesPedidoDentista(pedidoId);
    })
  );

  console.log("[Pedidos Dentista] ✅ Tabela de pedidos atualizada!");
}
function exibirErroNaTabela(mensagem) {
  const tabela = document.getElementById("tabela-pedidos-dentista");
  const tbody = tabela ? tabela.querySelector("tbody") : null;
  if (!tbody) return;

  tbody.innerHTML = `<tr><td colspan="7" style="color: red; text-align: center;">${mensagem}</td></tr>`;
}
function abrirFichaTecnica(pedidoId) {
  console.log(`📑 Abrindo ficha técnica do pedido ID: ${pedidoId}`);
  alert(`Funcionalidade para abrir ficha técnica do pedido #${pedidoId} ainda não implementada.`);
}
function verDetalhesPedidoDentista(pedidoId) {
  console.log(`🔎 Ver detalhes do pedido ID: ${pedidoId}`);

  // 🔥 Encontra o pedido no array de pedidos carregados
  const pedido = pedidosData.find(p => p.id == pedidoId);
  if (!pedido) {
    console.warn(`⚠️ Pedido ID ${pedidoId} não encontrado!`);
    return;
  }

  const pacienteId = pedido.paciente_id;
  if (!pacienteId) {
    console.warn(`⚠️ Pedido ID ${pedidoId} não possui um paciente associado!`);
    return;
  }

  console.log(`📌 Buscando informações do paciente ID: ${pacienteId}...`);

  // Atualiza o resumo do paciente
  preencherResumoPaciente(pacienteId).then(() => {
    // 🔥 Após carregar os dados, rola a tela até o Resumo do Paciente

  });
}

// Expõe as funções globalmente, se necessário
window.carregarPedidosDentista = carregarPedidosDentista;
window.abrirFichaTecnica = abrirFichaTecnica;
window.verDetalhesPedidoDentista = verDetalhesPedidoDentista;

// Inicia o carregamento dos pedidos quando o script é importado
carregarPedidosDentista();
