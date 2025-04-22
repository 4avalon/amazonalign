console.log("[cadastro_pedido] 🔥 Iniciando Cadastro de Pedido...");
import { capturarFichaTecnicaComoJSON } from "./ficha_tecnica_utils.js";
import { BASE_URL } from "../../../config.js"; // ajuste conforme o nível da pasta

// Aguarda o carregamento do DOM
setTimeout(() => {
    inicializarCadastroPedido();
}, 500);

function inicializarCadastroPedido() {
    console.log("📌 Inicializando Cadastro de Pedido...");

    const form = document.querySelector("#form-active form");
    if (!form) {
        console.error("❌ Formulário de cadastro de pedido não encontrado!");
        return;
    }

    // Remove qualquer evento de submit anterior para evitar duplicação
    form.removeEventListener("submit", handleCadastroPedido);
    form.addEventListener("submit", handleCadastroPedido);
}

async function handleCadastroPedido(event) {
    event.preventDefault(); // Evita recarregar a página

    const form = event.target;
    const formData = new FormData(form);

    // Captura dados do formulário básico do pedido
    const pedidoData = Object.fromEntries(formData.entries());

    // Adiciona o `dentista_id` e `paciente_id`
    pedidoData.dentista_id = localStorage.getItem("dentista_id");
    pedidoData.paciente_id = localStorage.getItem("paciente_id");
    pedidoData.status = 'aberto'; // valor padrão inicial

    // 🔹 Captura os dados da ficha técnica usando a função que já existe
    const fichaTecnicaData = capturarFichaTecnicaComoJSON();
    pedidoData.ficha_tecnica = fichaTecnicaData;

    // Envio dos dados ao backend
    try {
        const response = await fetch(`${BASE_URL}/pedidos`, {

            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify(pedidoData)
        });

        const result = await response.json();
if (response.ok) {
    alert("✅ Pedido cadastrado com sucesso!");
    document.getElementById("form-active").innerHTML = ""; // remove o formulário após sucesso
    location.reload(); // atualiza a página
} else {
    alert(`❌ Erro: ${result.message}`);
}

    } catch (error) {
        console.error("❌ Erro ao cadastrar pedido:", error);
        alert("Erro ao cadastrar pedido. Verifique sua conexão.");
    }
}

function validarFormulario(pedidoData) {
    if (!pedidoData.paciente_id) {
        console.warn("⚠️ Paciente não selecionado.");
        return false;
    }

    if (!pedidoData.ficha_tecnica || pedidoData.ficha_tecnica === "{}") {
        console.warn("⚠️ Ficha Técnica vazia.");
        return false;
    }

    return true; // Tudo OK
}


///testando salvar os pedidos com Ficha Tecnica json
async function salvarPedido() {
  try {
    // 🔹 1. Captura dados do formulário do pedido
    const idPaciente = document.getElementById("paciente_id").value;
    const descricao = document.getElementById("descricao_tratamento").value;
    const dataInicio = document.getElementById("data_inicio").value;

    // 🔹 2. Captura a ficha técnica (via função global)
    const fichaTecnica = window.fichaTecnicaUtils.capturarFichaTecnicaComoJSON();

    // 🔹 3. Monta o objeto a ser enviado
    const payload = {
      id_paciente: idPaciente,
      descricao: descricao,
      data_inicio: dataInicio,
      ficha_tecnica: fichaTecnica
    };

    // 🔹 4. Envia pro backend
    const response = await fetch("/api/pedidos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!response.ok) throw new Error("Erro ao salvar pedido");

    const resultado = await response.json();
    alert("✅ Pedido salvo com sucesso!");
    // Redirecionar ou atualizar tela
  } catch (error) {
    console.error("❌ Erro ao salvar pedido:", error);
    alert("Erro ao salvar o pedido.");
  }
}

