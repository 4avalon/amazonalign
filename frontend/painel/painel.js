    console.log("[painel] 🔄 Iniciando login.js...");

      // Função para carregar o login real dinamicamente
 async function carregarLogin() {
    console.log("🔄 Carregando login...");

    const response = await fetch("login/login.html");
    const loginHtml = await response.text();

    // Obtém o login-container para substituir apenas ele
    const loginContainer = document.getElementById("login-container");

    if (!loginContainer) {
        console.error("❌ login-container não encontrado!");
        return;
    }

    loginContainer.innerHTML = loginHtml; // 🔥 Substitui apenas o login-container

    console.log("✅ Login carregado com sucesso!");

    // 🔥 Agora que o login foi carregado, adicionamos os scripts necessários
    const authScript = document.createElement("script");
    authScript.src = "login/auth.js";
    document.body.appendChild(authScript);

    const loginScript = document.createElement("script");
    loginScript.src = "login/login.js";
    document.body.appendChild(loginScript);
}

// 🔥 Carregar login ao iniciar a página
carregarLogin();