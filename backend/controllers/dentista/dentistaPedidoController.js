const client = require("../../config/db");

// Lista os pedidos do dentista logado
async function listarPedidosDentista(req, res) {
  console.log("📦 Requisição: Listar pedidos do Dentista com filtros e ordenação");

  const { coluna, ordem, id, paciente_nome, status } = req.query;
  const dentistaId = req.usuario.id;

  console.log(`🔍 Parâmetros recebidos:`, { coluna, ordem, id, paciente_nome, status });

  let filtrosSql = "WHERE p.dentista_id = $1";
  const valores = [dentistaId];

  // 🔹 Aplicando filtros dinamicamente
  if (id) {
    filtrosSql += ` AND p.id::TEXT ILIKE $${valores.length + 1}`;
    valores.push(`%${id}%`);
  }
  if (paciente_nome) {
    filtrosSql += ` AND LOWER(pac.nome) LIKE LOWER($${valores.length + 1})`;
    valores.push(`%${paciente_nome}%`);
  }
  if (status) {
    filtrosSql += ` AND p.status = $${valores.length + 1}`;
    valores.push(status);
  }

  // 🔹 Aplicando ordenação
  let ordemSql = "p.created_at DESC";
  const colunasPermitidas = {
    id: "p.id",
    paciente_nome: "pac.nome",
    data_pagamento: "p.data_pagamento",
    status: "p.status",
  };

  if (coluna && colunasPermitidas[coluna]) {
    const direcao = ordem && ordem.toLowerCase() === "asc" ? "ASC" : "DESC";
    ordemSql = `${colunasPermitidas[coluna]} ${direcao} NULLS LAST`;
  }

  // 🔍 LOG: Mostrando a query gerada
  const querySQL = `
    SELECT 
      p.id, 
      pac.nome AS paciente_nome,
      p.paciente_id,
      COALESCE(TO_CHAR(p.data_pagamento, 'DD/MM/YYYY'), '--') AS data_pagamento,
      p.status, 
      p.arquivo_3d 
    FROM pedidos p
    LEFT JOIN pacientes pac ON pac.id = p.paciente_id
    ${filtrosSql}
    ORDER BY ${ordemSql}
  `;


  console.log("🛠 Query gerada:", querySQL);
  console.log("📌 Valores passados:", valores);

  try {
    const result = await client.query(querySQL, valores);
    console.log("✅ Resultado da query:", result.rows);

    res.status(200).json(result.rows);
  } catch (err) {
    console.error("❌ Erro ao listar pedidos:", err);
    res.status(500).json({ message: "Erro interno no servidor.", error: err.message });
  }
}


module.exports = {
  listarPedidosDentista
};
