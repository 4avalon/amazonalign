

console.log("[Admin] 🔥 Script tabela_admin.js carregado corretamente!");
import { BASE_URL } from "../../config.js"; // ajuste o caminho conforme a pasta atual
export let adminsData = [];

// Carrega a lista de administradores do backend
async function carregarAdmins() {
    console.log("[Admin] 🔄 Iniciando carregamento dos administradores...");

    try {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("❌ Usuário não autenticado! Redirecionando para login.");
            window.location.href = "/login.html";
            return;
        }

        console.log("🔍 Enviando requisição para buscar administradores...");
        const apiResponse = await fetch(`${BASE_URL}/admin/dentistas/dashboard`, {

            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        if (!apiResponse.ok) {
            throw new Error(`❌ Erro ao carregar administradores. Status: ${apiResponse.status}`);
        }

        adminsData = await apiResponse.json();
        console.log("✅ Administradores recebidos:", adminsData);

        // Renderiza a tabela 
        atualizarTabela();
    } catch (error) {
        console.error("❌ Erro ao carregar administradores:", error);
        const tabela = document.getElementById("tabela-admin");
        if (tabela) {
            tabela.innerHTML = `<tr><td colspan="8" style="color: red;">Erro ao carregar administradores.</td></tr>`;
        }
    }
}

// Renderiza a tabela de administradores (sem filtragem ou ordenação)
function atualizarTabela() {
    console.log("🔄 Atualizando tabela (sem filtros)...");

    const tabela = document.getElementById("tabela-admin");
    if (!tabela) {
        console.warn("⚠️ Tabela de administradores não encontrada!");
        return;
    }

    tabela.innerHTML = "";
    adminsData.forEach(admin => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${admin.id}</td>
            <td>${admin.nome} (ID: ${admin.id})</td>
            <td>
                <button class="btn btn-detalhes" onclick="exibirDetalhes(${admin.id})">📄 Ver Detalhes</button>
            </td>
            <td>${admin.is_admin ? "✅ Sim" : "❌ Não"}</td>
            <td>${admin.is_verified ? "✅ Sim" : "❌ Não"}</td>
            <td>${admin.total_pedidos}</td>
            <td>${admin.pedidos_abertos}</td>
            <td><!-- Botões de ação, se necessário --></td>
        `;
        tabela.appendChild(row);
    });

    console.log("✅ Tabela atualizada sem filtros!");
}

// Exibe detalhes de um dentista específico
function exibirDetalhes(id) {
    console.log(`🔍 Exibindo detalhes do dentista ID: ${id}`);

    // Ajusta o <select> para que o dentista apareça como selecionado
    const select = document.getElementById("dentista-select");
    if (!select) {
        console.error("❌ Elemento <select> não encontrado para exibir detalhes.");
        return;
    }

    // Cria a option se ainda não existir
    let option = select.querySelector(`option[value="${id}"]`);
    if (!option) {
        option = document.createElement("option");
        option.value = id;
        option.textContent = `Dentista ${id}`;
        select.appendChild(option);
    }
    select.value = id;

    // Chama a função de carregar detalhes (está normalmente em outro arquivo, ex: detalhes_admin.js)
    if (typeof carregarDetalhesDentista === "function") {
        console.log(`🔄 Buscando detalhes do dentista ID ${id} na API...`);
        carregarDetalhesDentista().then(() => {
            const marcador = document.getElementById("marcador-detalhes");
            if (marcador) {
                marcador.scrollIntoView({ behavior: "smooth", block: "start" });
            }
            console.log(`✅ Detalhes do dentista ID ${id} carregados e exibidos!`);
        });
    } else {
        console.warn("⚠️ Função carregarDetalhesDentista não encontrada! Verifique se detalhes_admin.js está importado.");
    }
}

// Expondo a função para uso no atributo onclick do botão
window.exibirDetalhes = exibirDetalhes;

// Inicia o carregamento assim que o arquivo for importado
carregarAdmins();
