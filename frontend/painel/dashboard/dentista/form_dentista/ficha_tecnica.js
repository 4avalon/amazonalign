
// Exibe o campo de "Outro" se a opção for selecionada
document.getElementById('local_documentacao').addEventListener('change', function() {
    const outroField = document.getElementById('outro-nome');
    if (this.value === 'Outro') {
        outroField.style.display = 'block';
    } else {
        outroField.style.display = 'none';
        document.getElementById('nome_outro').value = '';
    }
});
// Atualiza os chips com os números selecionados
// Seleciona os checkboxes e os contêineres das linhas
const checkboxes = document.querySelectorAll('.dental-grid input[type="checkbox"]');
const linhaSuperior = document.getElementById('linha-superior');
const linhaInferior = document.getElementById('linha-inferior');

checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
        // Limpa os chips das linhas
        linhaSuperior.innerHTML = 'Linha Superior:';
        linhaInferior.innerHTML = 'Linha Inferior:';

        // Atualiza os chips conforme o dente selecionado
        Array.from(checkboxes)
            .filter(checkbox => checkbox.checked)
            .forEach(checkbox => {
                const chip = document.createElement('span');
                chip.classList.add('chip');
                chip.textContent = checkbox.value;

                // Determina em qual linha o chip será adicionado
                if (checkbox.value >= 11 && checkbox.value <= 28) {
                    linhaSuperior.appendChild(chip);
                } else if (checkbox.value >= 31 && checkbox.value <= 48) {
                    linhaInferior.appendChild(chip);
                }
            });
    });
});

// Função para atualizar o status visual (Sim/Não) e classe ativa
function atualizarStatus(slider, status) {
    status.textContent = slider.value === "1" ? "Sim" : "Não";
    status.classList.toggle("active", slider.value === "1");
}

// Função para atualizar "Ambos" baseado nos valores de "Superior" e "Inferior"
function atualizarAmbos() {
    const superiorSlider = document.getElementById("expansao-superior");
    const inferiorSlider = document.getElementById("expansao-inferior");
    const ambosSlider = document.getElementById("expansao-ambos");
    const ambosStatus = document.getElementById("status-ambos");

    const superiorSim = superiorSlider.value === "1";
    const inferiorSim = inferiorSlider.value === "1";

    // Define "Ambos" como "Sim" somente se ambos forem "Sim"
    ambosSlider.value = (superiorSim && inferiorSim) ? "1" : "0";
    atualizarStatus(ambosSlider, ambosStatus);
}

// Função para sincronizar "Superior" e "Inferior" quando "Ambos" for alterado
function atualizarSuperiorInferior() {
    const superiorSlider = document.getElementById("expansao-superior");
    const inferiorSlider = document.getElementById("expansao-inferior");
    const ambosSlider = document.getElementById("expansao-ambos");
    const superiorStatus = document.getElementById("status-superior");
    const inferiorStatus = document.getElementById("status-inferior");

    const ambosSim = ambosSlider.value === "1";

    // Define "Superior" e "Inferior" conforme o valor de "Ambos"
    superiorSlider.value = ambosSim ? "1" : "0";
    inferiorSlider.value = ambosSim ? "1" : "0";
    atualizarStatus(superiorSlider, superiorStatus);
    atualizarStatus(inferiorSlider, inferiorStatus);
}
// Adiciona evento para cada slider
document.querySelectorAll(".expansion-slider").forEach((slider) => {
    slider.addEventListener("input", () => {
        const status = slider.nextElementSibling;
        atualizarStatus(slider, status);

        if (slider.id === "expansao-ambos") {
            // Atualiza "Superior" e "Inferior" quando "Ambos" for alterado
            atualizarSuperiorInferior();
        } else {
            // Atualiza "Ambos" quando "Superior" ou "Inferior" forem alterados
            atualizarAmbos();
        }
    });
});
function capturarDadosFichaTecnica() {
    //console.log("📌 Coletando dados da Ficha Técnica...");

    return {
        local_documentacao: document.getElementById("local_documentacao")?.value || null,
        nome_outro: document.getElementById("nome_outro")?.value || null,
        numeros_dentes: capturarNumerosDentes(),
        expansao: {
            superior: document.getElementById("expansao-superior")?.value === "1",
            inferior: document.getElementById("expansao-inferior")?.value === "1",
            ambos: document.getElementById("expansao-ambos")?.value === "1"
        }
    };
}
// Captura os números selecionados dos dentes
function capturarNumerosDentes() {
    return Array.from(document.querySelectorAll('.dental-grid input[type="checkbox"]:checked'))
                .map(checkbox => checkbox.value);
}
