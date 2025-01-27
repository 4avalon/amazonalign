    // dynamics.js
    console.log(`[Dynamics] carregado.`);

    import { config } from './config.js';
    import { loadComponent } from './loader.js';

    async function injectDynamics() {
        console.log("[Dynamics] Injetando componentes dinâmicos...");

        for (const dynamicKey of Object.keys(config.dynamics)) {
            const placeholders = document.querySelectorAll(`#${dynamicKey}-placeholder`);

            if (placeholders.length > 0) {
                console.log(`[Dynamics] ${placeholders.length} placeholders encontrados para "${dynamicKey}".`);

                for (const placeholder of placeholders) {
                    try {
                        console.log(`[Dynamics] Carregando componente "${dynamicKey}" no placeholder:`, placeholder);
                        await loadComponent("dynamics", dynamicKey);
                        console.log(`[Dynamics] Componente "${dynamicKey}" carregado com sucesso no placeholder.`);
                    } catch (error) {
                        console.error(`[Dynamics] Erro ao carregar componente "${dynamicKey}": ${error.message}`);
                    }
                }
            } else {
                console.log(`[Dynamics] Nenhum placeholder encontrado para "${dynamicKey}".`);
            }
        }

        console.log("[Dynamics] Finalizado o carregamento dos componentes dinâmicos.");
        
    }
    export { injectDynamics };