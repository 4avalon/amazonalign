// dentista.js
console.log("[Dentista] 🔥 Iniciando dentista.js...");

// Seleciona o container onde será injetado o módulo de pedidos
const pedidosContainer = document.getElementById("pedidos-container");
const pacienteContainer = document.getElementById("paciente-container");

// Função para carregar módulos dinamicamente (HTML, CSS e JS)
async function carregarModulo(container, htmlPath, cssPath, scriptPath, nome, callback) {
  console.log(`📂 Carregando módulo: ${nome}`);

  try {
    // Carrega o HTML do módulo
    const response = await fetch(htmlPath);
    if (!response.ok) throw new Error(`Módulo "${nome}" não encontrado!`);

    const moduloHtml = await response.text();
    container.innerHTML = moduloHtml;
    console.log(`✅ HTML do módulo "${nome}" carregado!`);

    // Carrega o CSS do módulo, se ainda não estiver carregado
    if (!document.querySelector(`link[href='${cssPath}']`)) {
      const cssLink = document.createElement("link");
      cssLink.rel = "stylesheet";
      cssLink.href = cssPath;
      document.head.appendChild(cssLink);
      console.log(`🎨 CSS do módulo "${nome}" carregado!`);
    }

    // Remove qualquer script antigo do mesmo módulo (para evitar duplicação)
    const existingScript = document.querySelector(`script[src='${scriptPath}']`);
    if (existingScript) {
      existingScript.remove();
      console.log(`🗑 Script antigo do módulo "${nome}" removido.`);
    }

    // Carrega o JS do módulo dinamicamente e executa o callback após o carregamento
    const script = document.createElement("script");
    script.src = scriptPath;
    script.type = "module";
    script.defer = true;

    script.onload = () => {
      console.log(`✅ JS do módulo "${nome}" carregado!`);
      if (typeof callback === "function") {
        console.log(`🚀 Executando callback para "${nome}"...`);
        callback();
      }
    };

    script.onerror = () => console.error(`❌ Erro ao carregar ${scriptPath}!`);

    document.body.appendChild(script);
  } catch (error) {
    console.error(`❌ Erro ao carregar "${nome}":`, error);
    container.innerHTML = `<p style="color: red;">Erro ao carregar "${nome}".</p>`;
  }
}
 // /**
// Carregando o módulo "pedidos_dentista"
  carregarModulo(
    pedidosContainer,
    "dashboard/dentista/modules/pedidos_dentista.html",  // Caminho do HTML do módulo
    "dashboard/dentista/modules/pedidos_dentista.css",   // Caminho do CSS do módulo
    "dashboard/dentista/modules/pedidos_dentista.js",    // Caminho do JS do módulo
    "pedidos_dentista",
    () => {
      console.log("🚀 Inicializando funcionalidades de pedidos (dentista)...");

    }
  );
//**/
// Carregando o módulo "paciente_dentista"

carregarModulo(
  pacienteContainer,
  "dashboard/dentista/modules/paciente_dentista.html",
  "dashboard/dentista/modules/paciente_dentista.css",
  "dashboard/dentista/modules/paciente_dentista.js",
  "paciente_dentista"
);


