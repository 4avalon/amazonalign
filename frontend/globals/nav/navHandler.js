// NavHandler.js
//console.log(`[NavHandler] carregado.`);

import { config } from '../../core/config.js'; // Configuração principal
import { loadComponent } from '../../core/loader.js'; // Loader para carregar componentes
import { injectDynamics } from '../../core/dynamics.js'; // Injetar dinâmicos

//console.log('[NavHandler] Iniciando.');

// Função principal para configurar o menu
function setupNavEvents() {
    //console.log('[NavHandler] Inicializando menu...');

    // Seleciona o elemento onde os itens do menu serão inseridos
    const menuList = document.querySelector('#menu-list');
    if (!menuList) {
        //console.error('[NavHandler] Elemento "#menu-list" não encontrado no DOM.');
        return;
    }

    // Gera itens do menu com base na configuração de páginas
    //console.log('[NavHandler] Gerando itens do menu...');
    const pages = Object.values(config.pages); // Obtém as páginas do `config`
    menuList.innerHTML = ''; // Limpa o menu antes de adicionar novos itens

    pages.forEach((page) => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `<a href="#${page.name}" data-page="${page.name}">${page.name.charAt(0).toUpperCase() + page.name.slice(1)}</a>`;
        menuList.appendChild(listItem);
    });

    //console.log('[NavHandler] Itens do menu gerados com sucesso.');

    // Adiciona eventos de clique aos links do menu
    menuList.addEventListener('click', async (event) => {
        const target = event.target;
        if (target.tagName === 'A') {
            event.preventDefault(); // Evita o comportamento padrão de navegação
            const pageName = target.getAttribute('data-page');
            if (pageName) {
                //console.log(`[NavHandler] Página "${pageName}" selecionada.`);
                try {
                    // Carrega a página selecionada
                    await loadComponent("pages", pageName);
                    //console.log(`[NavHandler] Página "${pageName}" carregada com sucesso.`);

                    // Injeta os componentes dinâmicos presentes na página
                    await injectDynamics();
                    //console.log(`[NavHandler] Componentes dinâmicos injetados com sucesso para a página "${pageName}".`);
                } catch (error) {
                    //console.error(`[NavHandler] Erro ao carregar a página ou dinâmicos "${pageName}": ${error.message}`);
                }
            }
        }
    });
}

// Exporta a função para uso no index.js
export { setupNavEvents };

