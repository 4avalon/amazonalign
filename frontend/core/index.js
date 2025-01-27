//index.js
import { loadComponent } from './loader.js';
import { injectDynamics } from './dynamics.js';

// Função de inicialização do aplicativo
async function init() {
    console.log("[Init] Inicializando aplicação...");

    try {
        // Carregar Navbar e Footer
        await loadComponent("globals", "nav");
        await loadComponent("globals", "footer");

        // Carregar página inicial
        await loadComponent("pages", "home");

        console.log("[Init] Aplicação inicializada com sucesso.");
    } catch (error) {
        console.error(`[Init] Erro durante inicialização: ${error.message}`);
    }
        await injectDynamics();
}


init();