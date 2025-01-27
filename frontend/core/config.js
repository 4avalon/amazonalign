//config.js
console.log(`[Config] carregado.`);
const config = {
    globals: {
        nav: { name: "nav", hasJs: true },        // Navbar, tem JS
        footer: { name: "footer", hasJs: false }, // Footer, sem JS
    },
    pages: {


        home: { name: "home", hasJs: false },
        credenciamento: { name: "credenciamento", hasJs: false },
        pedidos: { name: "pedidos", hasJs: false },
        about: { name: "about", hasJs: false },
        sustentabilidade: { name: "sustentabilidade", hasJs: false },
        theme: { name: "theme", hasJs: false },
        login: { name: "login", hasJs: false },
    },
    dynamics: {
        form: { name: "form", hasJs: true }, // Componente "carousel", tem JS
        search: { name: "search", hasJs: true }, // Componente "carousel", tem JS
        login: { name: "login", hasJs: true },                
        // Outros dinamics podem ser adicionados aqui
    },
};

// Exportar configuração para outros módulos (se necessário)
export { config };