console.log("[Form Dentista] 🔥 Script carregado corretamente!");

// Função para inicializar a seção de formulários
function inicializarFormularios() {
    console.log("📌 Inicializando sistema de formulários...");
    inicializarBotoesFormulario();
    inicializarBotoesExtras();
}

// Função para criar e adicionar eventos aos botões de formulário principais
function inicializarBotoesFormulario() {
    console.log("📌 Criando botões e adicionando eventos...");

    let btnCadastroPaciente = document.getElementById("btn-cadastro-paciente");
    let btnCadastroPedido = document.getElementById("btn-cadastro-pedido");

    if (!btnCadastroPaciente || !btnCadastroPedido) {
        console.error("❌ Botões principais não encontrados no DOM! Verifique se o HTML contém os elementos corretamente.");
        return;
    }

    btnCadastroPaciente.addEventListener("click", () => chamarFormulario("cadastro-paciente"));
    btnCadastroPedido.addEventListener("click", () => chamarFormulario("cadastro-pedido"));

    console.log("✅ Eventos adicionados aos botões principais de formulário!");
}

// Função para adicionar eventos a outros botões do sistema
function inicializarBotoesExtras() {
    console.log("📌 Procurando botões extras para carregar formulários...");

    let botoesExtras = document.querySelectorAll("[data-form]");
    botoesExtras.forEach(botao => {
        botao.addEventListener("click", () => {
            let tipo = botao.getAttribute("data-form");
            chamarFormulario(tipo);
        });
    });

    console.log("✅ Eventos adicionados aos botões extras de formulário!");
}

// Função que decide qual formulário carregar e faz scroll
function chamarFormulario(tipo) {
    console.log(`🔄 Chamando formulário: ${tipo}`);

    const formContainer = document.getElementById("form-active");

    // Verifica se já há um formulário carregado
    if (formContainer.innerHTML.trim() !== "") {
        console.log("🔄 Ocultando formulário anterior...");
        formContainer.innerHTML = ""; // Remove o conteúdo anterior
    }

    if (tipo === "cadastro-paciente") {
        carregarCadastroPaciente();
    } else if (tipo === "cadastro-pedido") {
        carregarCadastroPedido();
    } else {
        console.error("❌ Tipo de formulário inválido:", tipo);
        return;
    }

    // Scroll suave para a seção do formulário
    setTimeout(() => {
        formContainer.scrollIntoView({ behavior: "smooth" });
        console.log("📜 Scroll realizado até o formulário!");
    }, 300);
}

// 🔹 **Agora carregamos o HTML + Script de Cadastro de Paciente**
function carregarCadastroPaciente() {
    console.log("🔄 Carregando formulário de Cadastro de Paciente...");
    carregarFormulario(
        "dashboard/dentista/form_dentista/cadastro_paciente.html",
        "dashboard/dentista/form_dentista/cadastro_paciente.js"
    );
}

// 🔹 **Agora carregamos o HTML + Script de Cadastro de Pedido**
function carregarCadastroPedido() {
    console.log("🔄 Carregando formulários de Cadastro de Pedido e Ficha Técnica...");

    let caminhoPedido = "dashboard/dentista/form_dentista/cadastro_pedido.html";
    let caminhoFicha = "dashboard/dentista/form_dentista/ficha_tecnica.html";

    Promise.all([fetch(caminhoPedido), fetch(caminhoFicha)])
        .then(responses => Promise.all(responses.map(response => {
            if (!response.ok) {
                throw new Error(`Erro ao carregar um dos formulários: ${response.statusText}`);
            }
            return response.text();
        })))
        .then(([pedidoHtml, fichaHtml]) => {
            let formContainer = document.getElementById("form-active");
            formContainer.innerHTML = pedidoHtml + "<hr>" + fichaHtml; // Junta os dois formulários
            formContainer.style.display = "block";

            console.log("✅ Formulários de Pedido e Ficha Técnica carregados com sucesso!");

            // Agora carregamos os scripts específicos
            carregarScriptDinamico("dashboard/dentista/form_dentista/cadastro_pedido.js");
            carregarScriptDinamico("dashboard/dentista/form_dentista/ficha_tecnica.js");
        })
        .catch(error => console.error("❌ Erro ao carregar os formulários:", error));
}

// Função genérica para carregar formulários e garantir que o script correto seja carregado
function carregarFormulario(caminho, scriptPath = null) {
    console.log(`📥 Carregando HTML de: ${caminho}`);

    fetch(caminho)
        .then(response => {
            if (!response.ok) {
                throw new Error("Erro ao carregar o arquivo: " + response.statusText);
            }
            return response.text();
        })
        .then(html => {
            let formContainer = document.getElementById("form-active");

            formContainer.innerHTML = html; // Atualiza o conteúdo do formulário
            formContainer.style.display = "block";
            console.log("✅ Formulário carregado com sucesso!");

            // Se houver um script associado, carregá-lo dinamicamente
            if (scriptPath) {
                setTimeout(() => {
                    carregarScriptDinamico(scriptPath);
                }, 300);
            }
        })
        .catch(error => console.error("❌ Erro ao carregar o formulário:", error));
}

// Função para carregar um script dinamicamente
function carregarScriptDinamico(scriptPath) {
    console.log(`📜 Tentando carregar script: ${scriptPath}`);

    // Verifica se o script já foi carregado
    if (document.querySelector(`script[src="${scriptPath}"]`)) {
        console.warn(`⚠️ Script ${scriptPath} já foi carregado! Ignorando.`);
        return;
    }

    let script = document.createElement("script");
    script.src = scriptPath;
    script.type = "module";
    script.onload = () => console.log(`✅ Script carregado: ${scriptPath}`);
    script.onerror = () => console.error(`❌ Erro ao carregar script: ${scriptPath}`);

    document.body.appendChild(script);
}


// Executar a inicialização dos formulários
inicializarFormularios();


// ---------------------------------
// 📌 CADASTRO DE PACIENTE
// ---------------------------------

console.log("[cadastro_paciente] 🔥🔥🔥🔥 Iniciando");

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

    // Remove campos vazios para evitar problemas no backend
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
                "Authorization": `Bearer ${localStorage.getItem("token")}` // Certifique-se de que o usuário está autenticado
            },
            body: JSON.stringify(pacienteData)
        });

        console.log(`📡 Status da resposta: ${response.status}`);

        const result = await response.json();
        console.log("📩 Resposta do servidor:", result);

        if (response.ok) {
            alert("✅ Paciente cadastrado com sucesso!");
            form.reset(); // Limpa o formulário após sucesso
        } else {
            alert(`❌ Erro: ${result.message}`);
        }
    } catch (error) {
        console.error("❌ Erro ao cadastrar paciente:", error);
        alert("Erro ao cadastrar paciente. Verifique sua conexão.");
    }
}
