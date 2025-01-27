console.log("[SearchHandler] carregado. ");

import { generateFilePaths } from "../../core/path.js"; // Certifique-se de que o caminho esteja correto
import { config } from "../../core/config.js"; // Certifique-se de que o caminho esteja correto
import { loadComponent } from "../../core/loader.js"; // Ajuste o caminho, se necessário

function setupSearchEvents() {
    console.log("[SearchHandler] Configurando eventos de busca...");

    // Seleciona os elementos do DOM
    const searchInput = document.querySelector("#search-input");
    const searchButton = document.querySelector("#search-button");
    const resultsContainer = document.querySelector("#search-results-container");
    const resultsList = document.querySelector("#search-results");
    const closeDropdownButton = document.querySelector("#close-search-dropdown");

    if (!searchInput || !searchButton || !resultsContainer || !resultsList || !closeDropdownButton) {
        console.error("[SearchHandler] Elementos de busca não encontrados no DOM.");
        return;
    }

    // Fecha o dropdown de resultados
    closeDropdownButton.addEventListener("click", () => {
        resultsContainer.style.display = "none";
    });

    function performSearch() {
        const query = searchInput.value.trim().toLowerCase();
        console.log(`[SearchHandler] Query: "${query}"`);
        if (!query) {
            console.warn("[SearchHandler] Nenhuma palavra-chave inserida.");
            return;
        }

        resultsList.innerHTML = ""; // Limpa os resultados anteriores
        console.log("[SearchHandler] Limpando resultados antigos.");

        // Obtém as configurações de todas as páginas diretamente
        const pages = Object.entries(config.pages).map(([pageName, pageConfig]) => {
            const filePaths = generateFilePaths("pages", pageConfig);
            console.log(`[SearchHandler] Página detectada: ${pageName}, Paths:`, filePaths);
            return {
                name: pageName,
                ...filePaths,
            };
        });

        let foundResults = false;

        // Mapeia todas as páginas para verificar o conteúdo
        const fetchPromises = pages.map((page) => {
            console.log(`[SearchHandler] Buscando na página: ${page.name}`);
            return fetch(page.html)
                .then((response) => {
                    if (!response.ok) {
                        console.warn(`[SearchHandler] Falha ao carregar a página ${page.name}: ${response.status}`);
                        return "";
                    }
                    console.log(`[SearchHandler] Página carregada: ${page.name}`);
                    return response.text();
                })
                .then((html) => {
                    if (html.toLowerCase().includes(query)) {
                        console.log(`[SearchHandler] Palavra-chave encontrada na página: ${page.name}`);
                        const snippet = extractAndHighlightSnippet(html, query, 100);
                        const resultItem = document.createElement("div");
                        resultItem.className = "search-item";
                        resultItem.innerHTML = `
                            <h3>${page.name.charAt(0).toUpperCase() + page.name.slice(1)}</h3>
                            <p>${snippet}</p>
                        `;
                        resultItem.addEventListener("click", () => {
                            console.log(`[SearchHandler] Clique detectado para: ${page.name}`);
                            window.location.hash = page.name; // Atualiza o hash na URL
                            resultsContainer.style.display = "none"; // Fecha o dropdown
                            const navEvent = new Event("hashchange");
                            console.log("[SearchHandler] Disparando evento de hashchange.");
                            window.dispatchEvent(navEvent);
                        });

                        resultsList.appendChild(resultItem);
                        foundResults = true;
                    } else {
                        console.log(`[SearchHandler] Palavra-chave não encontrada na página: ${page.name}`);
                    }
                })
                .catch((error) => console.error(`[SearchHandler] Erro ao buscar na página ${page.name}: ${error.message}`));
        });

        // Processa os resultados
        Promise.all(fetchPromises).then(() => {
            if (!foundResults) {
                console.warn("[SearchHandler] Nenhum resultado encontrado.");
                const noResultItem = document.createElement("div");
                noResultItem.className = "search-item";
                noResultItem.innerHTML = `<p>Nenhum resultado encontrado.</p>`;
                resultsList.appendChild(noResultItem);
            }
            resultsContainer.style.display = "block"; // Mostra o dropdown
            console.log("[SearchHandler] Resultados exibidos.");
        });
    }

    // Função para extrair e destacar os trechos encontrados
    function extractAndHighlightSnippet(content, keyword, length) {
        const sanitizedContent = content.replace(/<[^>]*>?/gm, ""); // Remove tags HTML
        const index = sanitizedContent.toLowerCase().indexOf(keyword);
        if (index === -1) return "";
        const start = Math.max(0, index - length / 2);
        const end = Math.min(sanitizedContent.length, index + length / 2);
        const snippet = sanitizedContent
            .substring(start, end)
            .replace(new RegExp(keyword, "gi"), (match) => `<mark>${match}</mark>`); // Destaca o termo pesquisado
        console.log(`[SearchHandler] Snippet gerado: "${snippet}"`);
        return snippet;
    }

    // Configura eventos para o botão e o input
    searchButton.addEventListener("click", performSearch);
    searchInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            performSearch();
        }
    });

    
}
// Configura o listener para mudanças no hash da URL
window.addEventListener("hashchange", async () => {
    const page = window.location.hash.substring(1);
    console.log(`[Navigation] Hash mudou para: ${page}`);
    try {
        await loadComponent("pages", page);
        console.log(`[Navigation] Página "${page}" carregada com sucesso.`);
    } catch (error) {
        console.error(`[Navigation] Erro ao carregar a página "${page}": ${error.message}`);
    }
});

// Expõe a função globalmente
window.setupSearchEvents = setupSearchEvents;

export { setupSearchEvents };
