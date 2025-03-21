console.log("[cadastro_pedido] 🔥 Iniciando Cadastro de Pedido...");

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

    // Converte os dados do formulário para um objeto
    const pedidoData = Object.fromEntries(formData.entries());

    // Adiciona o `dentista_id` e `paciente_id`
    pedidoData.dentista_id = localStorage.getItem("dentista_id") || null;
    pedidoData.paciente_id = localStorage.getItem("paciente_id") || null;

    // 🔹 Captura os dados da ficha técnica e os converte para JSON
    const fichaTecnicaData = capturarDadosFichaTecnica();
    pedidoData.ficha_tecnica = JSON.stringify(fichaTecnicaData); // Converte JSON para string

    // Validação: Garante que todos os campos obrigatórios estão preenchidos
    if (!validarFormulario(pedidoData)) {
        alert("⚠️ Preencha todos os campos obrigatórios antes de continuar.");
        return;
    }

    console.log("📤 Enviando Pedido + Ficha Técnica:", pedidoData);

    try {
        const response = await fetch("http://localhost:5000/pedidos", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify(pedidoData)
        });

        const result = await response.json();
        console.log("📩 Resposta do servidor:", result);

        if (response.ok) {
            alert("✅ Pedido cadastrado com sucesso!", () => location.reload()); // 🔄 Recarrega ao clicar em "OK"
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

