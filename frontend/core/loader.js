// loader.js
console.log(`[loader] carregado.`);
import { config } from './config.js';
import { generateFilePaths } from './path.js';

async function loadComponent(type, name) {
    const entry = config[type]?.[name];
    if (!entry) throw new Error(`[Loader] Componente "${name}" não encontrado no tipo "${type}".`);

    const { html, css, js, functionName } = generateFilePaths(type, entry);
    const containerId =
        type === "globals" ? `${name}-container` :
        type === "pages" ? "pages-container" :
        `${name}-placeholder`;

    const container = document.getElementById(containerId);
    if (!container) throw new Error(`[Loader] Container "${containerId}" não encontrado no DOM.`);

    try {
        const response = await fetch(html);
        if (!response.ok) throw new Error(`[Loader] Erro ao carregar HTML: ${html}`);
        container.innerHTML = await response.text();
        console.log(`[Loader] HTML carregado para "${name}".`);

        if (css) {
            const link = document.createElement("link");
            link.rel = "stylesheet";
            link.href = css;
            document.head.appendChild(link);
            console.log(`[Loader] CSS carregado: ${css}`);
        }

            if (js && functionName) {
                const module = await import(js);
                const setupFunction = module[functionName] || window[functionName]; // Adiciona fallback para `window`
                if (setupFunction) {
                    setupFunction();
                    console.log(`[Loader] Função de setup executada para "${name}".`);
                } else {
                    console.warn(`[Loader] Função "${functionName}" não encontrada para "${name}".`);
                }
            }

    } catch (error) {
        console.error(`[Loader] Erro ao carregar componente "${name}": ${error.message}`);
        throw error;
    }
}

export { loadComponent };
