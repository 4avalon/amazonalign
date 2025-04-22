//console.log("📌Ficha Técnica utils...");
export function capturarFichaTecnicaComoJSON() {
    const formData = {};
    formData.local_documentacao = document.getElementById("local_documentacao")?.value || null;
    formData.nome_outro = document.getElementById("nome_outro")?.value || null;
    formData.arcos_tratados = document.getElementById("arcos_tratados")?.value || null;

    formData.restricao_movimento = Array.from(
        document.querySelectorAll('.dental-grid input[type="checkbox"]:checked')
    ).map(el => el.value);

    formData.expansao = {
        superior: document.getElementById("expansao-superior")?.value === "1",
        inferior: document.getElementById("expansao-inferior")?.value === "1",
        ambos: document.getElementById("expansao-ambos")?.value === "1"
    };

    const linhaMediaSelecionada = document.querySelector('input[name="linha_media"]:checked');
    formData.linha_media = linhaMediaSelecionada?.value || null;

    formData.mordida_profunda = {
        maxila_extrusao: document.querySelector('input[name="mordida_profunda_maxila_extrusao"]')?.checked || false,
        maxila_intrusao: document.querySelector('input[name="mordida_profunda_maxila_intrusao"]')?.checked || false,
        mandibula_extrusao: document.querySelector('input[name="mordida_profunda_mandibula_extrusao"]')?.checked || false,
        mandibula_intrusao: document.querySelector('input[name="mordida_profunda_mandibula_intrusao"]')?.checked || false
    };

    formData.mordida_aberta = {
        maxila_extrusao: document.querySelector('input[name="mordida_aberta_maxila_extrusao"]')?.checked || false,
        mandibula_extrusao: document.querySelector('input[name="mordida_aberta_mandibula_extrusao"]')?.checked || false
    };

    formData.distalizacao = {
        bloco: document.querySelector('input[name="distalizacao_bloco"]')?.checked || false,
        sequencial: document.querySelector('input[name="distalizacao_sequencial"]')?.checked || false,
        mantem_malocl: document.querySelector('input[name="distalizacao_mantem_malocl"]')?.checked || false,
        outro: document.querySelector('input[name="distalizacao_outro"]')?.value || ""
    };

    const diastemaSelecionado = document.querySelector('input[name="diastemas"]:checked');
    formData.diastemas = diastemaSelecionado?.value || null;
    formData.diastemas_outro = document.querySelector('input[name="diastemas_outro"]')?.value || "";

    const mecanicas = ["attachments", "ipr_slice", "botoes", "levante_mordida", "dispositivo_ancoragem"];
    formData.mecanicas_auxiliares = {};
    mecanicas.forEach(item => {
        const selecionado = document.querySelector(`input[name="${item}"]:checked`);
        formData.mecanicas_auxiliares[item] = selecionado?.value || null;
    });

    formData.objetivos_tratamento = document.querySelector('textarea[name="objetivos_tratamento"]')?.value || "";

    return formData;
}

export function preencherFichaTecnicaComJSON(json) {
    if (!json || typeof json !== "object") return;
    setValue("local_documentacao", json.local_documentacao);
    setValue("nome_outro", json.nome_outro);
    setValue("arcos_tratados", json.arcos_tratados);
    marcarCheckboxPorValor("restricao_movimento[]", json.restricao_movimento || []);
    setSlider("expansao-superior", json.expansao?.superior);
    setSlider("expansao-inferior", json.expansao?.inferior);
    setSlider("expansao-ambos", json.expansao?.ambos);
    selecionarRadio("linha_media", json.linha_media);
    marcarCheckboxDireto("mordida_profunda_maxila_extrusao", json.mordida_profunda?.maxila_extrusao);
    marcarCheckboxDireto("mordida_profunda_maxila_intrusao", json.mordida_profunda?.maxila_intrusao);
    marcarCheckboxDireto("mordida_profunda_mandibula_extrusao", json.mordida_profunda?.mandibula_extrusao);
    marcarCheckboxDireto("mordida_profunda_mandibula_intrusao", json.mordida_profunda?.mandibula_intrusao);
    marcarCheckboxDireto("mordida_aberta_maxila_extrusao", json.mordida_aberta?.maxila_extrusao);
    marcarCheckboxDireto("mordida_aberta_mandibula_extrusao", json.mordida_aberta?.mandibula_extrusao);
    marcarCheckboxDireto("distalizacao_bloco", json.distalizacao?.bloco);
    marcarCheckboxDireto("distalizacao_sequencial", json.distalizacao?.sequencial);
    marcarCheckboxDireto("distalizacao_mantem_malocl", json.distalizacao?.mantem_malocl);
    setValue("distalizacao_outro", json.distalizacao?.outro);
    selecionarRadio("diastemas", json.diastemas);
    setValue("diastemas_outro", json.diastemas_outro);
    if (json.mecanicas_auxiliares) {
        Object.entries(json.mecanicas_auxiliares).forEach(([key, value]) => {
            selecionarRadio(key, value);
        });
    }
    setValue("objetivos_tratamento", json.objetivos_tratamento);
}

// Helpers
function setValue(id, valor) {
    const el = document.getElementById(id);
    if (el) {
        el.value = valor ?? "";
        el.dispatchEvent(new Event("change"));
    }
}

function selecionarRadio(name, value) {
    const radio = document.querySelector(`input[name="${name}"][value="${value}"]`);
    if (radio) {
        radio.checked = true;
        radio.dispatchEvent(new Event("change"));
    }
}

function marcarCheckboxPorValor(name, values) {
    document.querySelectorAll(`input[name="${name}"]`).forEach(checkbox => {
        checkbox.checked = values.includes(checkbox.value);
        checkbox.dispatchEvent(new Event("change"));
    });
}

function marcarCheckboxDireto(name, marcado) {
    const el = document.querySelector(`input[name="${name}"]`);
    if (el) {
        el.checked = !!marcado;
        el.dispatchEvent(new Event("change"));
    }
}

function setSlider(id, ativo) {
    const slider = document.getElementById(id);
    if (slider) {
        slider.value = ativo ? "1" : "0";
        slider.dispatchEvent(new Event("input"));
    }
}

// Torna acessível globalmente
window.fichaTecnicaUtils = {
    capturarFichaTecnicaComoJSON,
    preencherFichaTecnicaComJSON
};
