    //console.log("[painel] 🔄 Iniciando login.js...");

      // Função para carregar o login real dinamicamente
 async function carregarLogin() {
    //console.log("🔄 Carregando login...");

    const response = await fetch("login/login.html");
    const loginHtml = await response.text();

    // Obtém o login-container para substituir apenas ele
    const loginContainer = document.getElementById("login-container");

    if (!loginContainer) {
        console.error("❌ login-container não encontrado!");
        return;
    }

    loginContainer.innerHTML = loginHtml; // 🔥 Substitui apenas o login-container

    //console.log("✅ Login carregado com sucesso!");

    // 🔥 Agora que o login foi carregado, adicionamos os scripts necessários
    const authScript = document.createElement("script");
    authScript.type = "module"; // CORRETO
    authScript.src = "login/auth.js";
    document.body.appendChild(authScript);

    const loginScript = document.createElement("script");
    loginScript.type = "module"; // CORRETO
    loginScript.src = "login/login.js";
    document.body.appendChild(loginScript);

}
window.carregarScriptDinamico = function(scriptPath) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${scriptPath}"]`)) return resolve();

    const script = document.createElement("script");
    script.src = scriptPath;
    script.onload = resolve;
    script.onerror = reject;
    document.body.appendChild(script);
  });
};

// 🔥 Carregar login ao iniciar a página
carregarLogin();

document.getElementById("fechar-modal-ficha").onclick = () => {
  document.getElementById("modal-ficha-tecnica").style.display = "none";
  document.getElementById("modal-overlay").style.display = "none";
};
