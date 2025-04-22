//console.log("[Dentista] 🔥 Iniciando dentista.js...");

const pedidosContainer = document.getElementById("pedidos-container");
const pacienteContainer = document.getElementById("paciente-container");
const formContainer = document.getElementById("form-container");

async function carregarModulo(container, htmlPath, cssPath, scriptPath, nome, callback) {
  //console.log(`📂[Dentista] Carregando módulo: ${nome}`);
  try {
    const response = await fetch(htmlPath);
    if (!response.ok) throw new Error(`Módulo "${nome}" não encontrado!`);
    const moduloHtml = await response.text();
    container.innerHTML = moduloHtml;
    //console.log(`✅[Dentista] HTML do módulo "${nome}" carregado!`);

    if (!document.querySelector(`link[href='${cssPath}']`)) {
      const cssLink = document.createElement("link");
      cssLink.rel = "stylesheet";
      cssLink.href = cssPath;
      document.head.appendChild(cssLink);
      //console.log(`🎨[Dentista] CSS do módulo "${nome}" carregado!`);
    }


    const script = document.createElement("script");
    script.src = scriptPath;
    script.type = "module";
    script.defer = true;
    script.onload = () => {
      //console.log(`✅[Dentista] JS do módulo "${nome}" carregado!`);
    };
    script.onerror = () => console.error(`❌ Erro ao carregar ${scriptPath}!`);
    document.body.appendChild(script);
  } catch (error) {
    console.error(`❌[Dentista] Erro ao carregar "${nome}":`, error);
    container.innerHTML = `<p style="color: red;">Erro ao carregar "${nome}".</p>`;
  }
}

// ⚡ Carrega os módulos e inicializa corretamente

carregarModulo(
  pedidosContainer,
  "dashboard/dentista/pedidos_dentista.html",
  "dashboard/dentista/pedidos_dentista.css",
  "dashboard/dentista/pedidos_dentista.js",
  "pedidos_dentista"
);

carregarModulo(
  pacienteContainer,
  "dashboard/dentista/paciente_dentista.html",
  "dashboard/dentista/paciente_dentista.css",
  "dashboard/dentista/paciente_dentista.js",
  "paciente_dentista"
);

carregarModulo(
  formContainer,
  "dashboard/dentista/form_dentista.html",
  "dashboard/dentista/form_dentista.css",
  "dashboard/dentista/form_dentista.js",
  "form_dentista"
);
