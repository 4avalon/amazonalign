export function initSortAndFilters(tableId, carregarDados) {
  const table = document.getElementById(tableId);
  if (!table) {
    console.error(`❌ Tabela com ID '${tableId}' não encontrada!`);
    return;
  }

  const ordenacao = { coluna: "", ordem: "" };
  const filtros = {};

  // 🔹 Captura clique nos botões de ordenação
table.querySelectorAll(".sort-btn").forEach(btn => {
    let state = 0; // 0 = neutro, 1 = asc, 2 = desc
    const column = btn.getAttribute("data-column");

    btn.addEventListener("click", async () => {
        table.querySelectorAll(".sort-btn").forEach(b => {
            if (b !== btn) {
                b.classList.remove("asc", "desc");
                b.innerText = "⇅";
            }
        });

        state = (state + 1) % 3;
        btn.classList.remove("asc", "desc");

        if (state === 1) {
            btn.classList.add("asc");
            btn.innerText = "↑";
            ordenacao.coluna = column;
            ordenacao.ordem = "asc";
        } else if (state === 2) {
            btn.classList.add("desc");
            btn.innerText = "↓";
            ordenacao.coluna = column;
            ordenacao.ordem = "desc";
        } else {
            btn.innerText = "⇅";
            ordenacao.coluna = "";
            ordenacao.ordem = "";
        }

        console.log(`🔄 Ordenando: "${ordenacao.coluna}" | Direção: "${ordenacao.ordem}"`);
        await carregarDados({ ordenacao, filtros });
    });
});


  // 🔹 Captura mudança nos inputs de filtro
  table.querySelectorAll("thead input, thead select").forEach(input => {
    input.addEventListener("input", async () => {
      const key = input.id.replace("filtro-", ""); // Remove prefixo "filtro-"
      filtros[key] = input.value.trim();

      console.log(`🔎 Aplicando filtro: ${key} = "${filtros[key]}"`);
      await carregarDados({ ordenacao, filtros });
    });
  });
}
