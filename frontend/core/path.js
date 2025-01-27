// path.js
console.log(`[path] carregado.`);
// Determina automaticamente a pasta raiz a partir do caminho da URL
const raiz = `${window.location.origin}/${window.location.pathname.split('/')[1]}`; // Obtém o primeiro segmento após "/"
const frontend = "frontend"; // Diretório do frontend

function generateFilePaths(type, entry) {
    const { name, hasJs } = entry;
    const basePath = `${raiz}/${frontend}/${type}/${name}`; // Caminho base para o componente
    const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1); // Nome formatado para função
    return {
        html: `${basePath}/${name}.html`, // Caminho do arquivo HTML
        css: `${basePath}/${name}.css`, // Caminho do arquivo CSS
        js: hasJs ? `${basePath}/${name}Handler.js` : null, // Caminho do arquivo JS, se existir
        functionName: hasJs ? `setup${capitalizedName}Events` : null, // Nome da função de setup, se houver JS
    };
}

export { generateFilePaths };
