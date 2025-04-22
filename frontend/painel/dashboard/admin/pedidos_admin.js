console.log("[Pedidos Admin] 🔥 Script pedidos_admin.js carregado corretamente!");
import { BASE_URL } from "../../config.js"; // ajuste o caminho conforme a pasta atual
let pedidosOriginais = [];

// Carrega a lista de pedidos do backend
async function carregarPedidos() {
    console.log("[Pedidos Admin] 🔄 Iniciando carregamento de pedidos...");

    try {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("❌ Usuário não autenticado! Redirecionando para login.");
            window.location.href = "/login.html";
            return;
        }

        console.log("🔍 Enviando requisição para buscar pedidos...");
        const apiResponse = await fetch(`${BASE_URL}/admin/pedidos/dashboard`, {

            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        if (!apiResponse.ok) {
            throw new Error(`❌ Erro ao carregar pedidos. Status: ${apiResponse.status}`);
        }

        pedidosOriginais = await apiResponse.json();
        console.log("✅ Pedidos recebidos:", pedidosOriginais);

        // Renderiza a tabela sem aplicar filtros locais
        renderizarTabelaPedidos();
        
    } catch (error) {
        console.error("❌ Erro ao carregar pedidos_admin:", error);
        const tabelaPedidos = document.getElementById("pedidos-admin");
        if (tabelaPedidos) {
            tabelaPedidos.innerHTML = `<tr><td colspan="7" style="color: red;">Erro ao carregar pedidos.</td></tr>`;
        }
    }
}

// Renderiza a tabela de pedidos sem filtros
function renderizarTabelaPedidos() {
    console.log("🔄 Renderizando tabela de pedidos...");

    const tabelaPedidos = document.getElementById("pedidos-admin");
    if (!tabelaPedidos) {
        console.warn("⚠️ Elemento #pedidos-admin não encontrado!");
        return;
    }

    tabelaPedidos.innerHTML = "";

    // Se não houver pedidos
    if (!pedidosOriginais.length) {
        tabelaPedidos.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; font-weight: bold;">
                    Nenhum pedido encontrado.
                </td>
            </tr>`;
        return;
    }

    // Monta cada linha da tabela
    pedidosOriginais.forEach(pedido => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${pedido.dentista_nome}</td>
            <td>${pedido.paciente_nome}</td>
            <td>${new Date(pedido.data_pagamento).toLocaleDateString()}</td>
            <td>${pedido.status}</td>
            <td>
                <button class="btn ficha-btn" data-info='${JSON.stringify(pedido.ficha_tecnica || {})}'>
                    📄 Ver Ficha
                </button>
            </td>
            <td>
                ${pedido.arquivo_3d 
                    ? `<a href="${pedido.arquivo_3d}" target="_blank" class="btn">📁 Baixar</a>` 
                    : "❌ Sem Arquivo"}
            </td>
            <td>${pedido.video_conferencia ? "✅ Sim" : "❌ Não"}</td>
        `;
        tabelaPedidos.appendChild(row);
    });

    console.log("✅ Tabela de pedidos renderizada!");
}

// 🔥 Inicia o carregamento dos pedidos assim que o arquivo é importado
carregarPedidos();
