// frontend/pages/login/loginHandler.js
function setupLoginEvents() {
    console.log("[setupLoginEvents] Configurando eventos de login...");

    // Captura os elementos necessários no DOM
    const loginForm = document.getElementById("loginForm");
    const userNameElement = document.getElementById("user-name");
    const loginPanel = document.getElementById("login-panel");

    if (!loginForm || !userNameElement || !loginPanel) {
        console.error("[LoginHandler] Elementos necessários não encontrados no DOM.");
        return;
    }

    // Adiciona evento de envio ao formulário
    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault(); // Evita o reload da página

        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        try {
            console.log("[LoginHandler] Tentando logar com o backend...");
            const response = await fetch("http://localhost:3000/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                console.error("[LoginHandler] Erro do servidor:", errorMessage);
                userNameElement.textContent = "Erro: Login inválido";
                userNameElement.style.color = "red";
                return;
            }

            const data = await response.json();
            console.log("[LoginHandler] Login bem-sucedido:", data);

            // Atualiza o painel de boas-vindas com o nome do usuário
            userNameElement.textContent = data.message || "Usuário";
            userNameElement.style.color = "green"; // Define a cor verde para sucesso
            loginPanel.style.display = "block"; // Garante que o painel fique visível
        } catch (error) {
            console.error("[LoginHandler] Erro ao conectar ao backend:", error);
            userNameElement.textContent = "Erro ao conectar ao servidor";
            userNameElement.style.color = "red";
        }
    });
}

// Exporta a função para ser usada no Loader
window.setupLoginEvents = setupLoginEvents;
export { setupLoginEvents };
