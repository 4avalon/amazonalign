console.log("[cadastro_paciente] 🔥🔥🔥🔥 Iniciando");

// Aguarda um pequeno tempo para garantir que o formulário foi carregado
setTimeout(() => {
    inicializarCadastroPaciente();
}, 500);

function inicializarCadastroPaciente() {
    console.log("📌 Inicializando Cadastro de Paciente...");

    const form = document.querySelector("#form-cadastro-paciente");
    if (!form) {
        console.error("❌ Formulário de cadastro de paciente não encontrado!");
        return;
    }

    // Remove qualquer evento de submit anterior para evitar duplicação
    form.removeEventListener("submit", handleCadastroPaciente);
    form.addEventListener("submit", handleCadastroPaciente);

    // Confere se o dentista_id está salvo no localStorage
    const dentistaId = localStorage.getItem("dentista_id");
    if (dentistaId) {
        document.getElementById("dentista_id").value = dentistaId;
        console.log(`🦷 Dentista ID encontrado: ${dentistaId}`);
    } else {
        console.warn("⚠️ Nenhum dentista_id encontrado no localStorage!");
    }
}

async function handleCadastroPaciente(event) {
    event.preventDefault(); // Evita o reload da página

    const form = event.target;
    const formData = new FormData(form);
    const pacienteData = Object.fromEntries(formData.entries()); // Converte FormData para objeto

    // Remove campos vazios
    Object.keys(pacienteData).forEach(key => {
        if (pacienteData[key] === "") {
            delete pacienteData[key];
        }
    });

    console.log("📤 Enviando dados do paciente:", JSON.stringify(pacienteData, null, 2));

    try {
        const response = await fetch("http://localhost:5000/pacientes", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify(pacienteData)
        });

        console.log(`📡 Status da resposta: ${response.status}`);

        const result = await response.json();
        console.log("📩 Resposta do servidor:", result);

if (response.ok) {
    form.reset(); // Limpa o formulário

    // 🔹 Exibe o alerta e, após o usuário clicar em "OK", recarrega a página
    alert("✅ Paciente cadastrado com sucesso!");
    location.reload(); // 🔄 Atualiza a página automaticamente após o OK do alerta
} else {
            alert(`❌ Erro: ${result.message}`);
        }
    } catch (error) {
        console.error("❌ Erro ao cadastrar paciente:", error);
        alert("Erro ao cadastrar paciente. Verifique sua conexão.");
    }
}

