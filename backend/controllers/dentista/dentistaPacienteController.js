const client = require("../../config/db");

// Lista os pacientes vinculados ao dentista logado
async function listarPacientesDashboard(req, res) {
  console.log("📋 Requisição: Listar pacientes para o Dashboard do Dentista");

  try {
    // 🔹 Captura parâmetros de query para filtros e ordenação
    const { coluna, ordem, nome, sexo } = req.query;
    const dentistaId = req.usuario.id;

    // 🔹 Buscar os dados do dentista logado
    const { rows: [dentista] } = await client.query(
      `SELECT id, nome, TO_CHAR(data_nascimento, 'DD/MM/YYYY') AS data_nascimento, sexo 
       FROM dentistas WHERE id = $1`,
      [dentistaId]
    );

    if (!dentista) {
      return res.status(403).json({ message: "Dentista não encontrado." });
    }

    console.log("🦷 Dentista logado:", dentista);

    // 🔹 Monta os filtros dinamicamente
    let filtrosSql = "WHERE p.dentista_id = $1";
    const valores = [dentistaId];

    if (nome) {
      filtrosSql += ` AND p.nome ILIKE $${valores.length + 1}`;
      valores.push(`%${nome}%`);
    }

    if (sexo) {
      filtrosSql += ` AND p.sexo = $${valores.length + 1}`;
      valores.push(sexo);
    }

    // 🔹 Define a ordenação (default: ordenar por nome ASC)
    let ordemSql = "p.nome ASC";
    const colunasPermitidas = {
      id: "p.id",
      nome: "p.nome",
      data_nascimento: "p.data_nascimento",
      sexo: "p.sexo",
      pedidos_abertos: "pedidos_abertos"
    };

    if (coluna && colunasPermitidas[coluna]) {
      const direcao = ordem && ordem.toLowerCase() === "desc" ? "DESC" : "ASC";
      ordemSql = `${colunasPermitidas[coluna]} ${direcao} NULLS LAST`;
    }

    // 🔹 Buscar pacientes do dentista logado com filtros e ordenação
    const result = await client.query(
      `SELECT 
          p.id, 
          p.nome, 
          TO_CHAR(p.data_nascimento, 'DD/MM/YYYY') AS data_nascimento,
          p.sexo, 
          COUNT(pe.id) AS pedidos_abertos
      FROM pacientes p
      LEFT JOIN pedidos pe 
          ON p.id = pe.paciente_id 
          AND pe.status NOT IN ('cancelado', 'entregue')
      ${filtrosSql}
      GROUP BY p.id, p.nome, p.data_nascimento, p.sexo
      ORDER BY ${ordemSql};`,
      valores
    );

    console.log("✅ Pacientes do banco:", JSON.stringify(result.rows, null, 2));
    res.status(200).json(result.rows);

  } catch (err) {
    console.error("❌ Erro ao listar pacientes:", err);
    res.status(500).json({ message: "Erro interno no servidor.", error: err.message });
  }
}

// Obtém os detalhes de um paciente específico + pedidos com filtros e ordenação
async function obterDetalhesPaciente(req, res) {
  const { id } = req.params;
  const { coluna, ordem } = req.query;
  console.log(`🔍 Buscando detalhes do paciente ID=${id} para o Dentista`);

  try {
    // Buscar informações do paciente
    const pacienteResult = await client.query(
      `SELECT 
          id, 
          nome, 
          telefone, 
          COALESCE(TO_CHAR(data_nascimento, 'DD/MM/YYYY'), '--') AS data_nascimento, 
          COALESCE(sexo, '--') AS sexo
       FROM pacientes 
       WHERE id = $1 AND dentista_id = $2`,
      [id, req.usuario.id]
    );

    if (pacienteResult.rows.length === 0) {
      return res.status(404).json({ message: "Paciente não encontrado." });
    }
    const paciente = pacienteResult.rows[0];

    // 🔹 Definição da ordenação para pedidos
    let ordemSql = "created_at DESC";
    const colunasPermitidas = {
      id: "id",
      ficha_tecnica: "ficha_tecnica",
      status: "status",
      data_pagamento: "data_pagamento"
    };

    if (coluna && colunasPermitidas[coluna]) {
      const direcao = ordem && ordem.toLowerCase() === "desc" ? "DESC" : "ASC";
      ordemSql = `${colunasPermitidas[coluna]} ${direcao} NULLS LAST`;
    }

    // Buscar os pedidos do paciente com ordenação dinâmica
    const pedidosResult = await client.query(
      `SELECT 
          id, 
          ficha_tecnica::TEXT, 
          arquivo_3d, 
          status, 
          COALESCE(TO_CHAR(data_pagamento, 'DD/MM/YYYY'), '--') AS data_pagamento
       FROM pedidos 
       WHERE paciente_id = $1
       ORDER BY ${ordemSql}`,
      [id]
    );

    // Converte ficha_tecnica de JSON string para um objeto válido
    const pedidos = pedidosResult.rows.map(pedido => ({
      id: pedido.id,
      ficha_tecnica: JSON.parse(pedido.ficha_tecnica || "{}"),
      arquivo_3d: pedido.arquivo_3d,
      status: pedido.status,
      data_pagamento: pedido.data_pagamento
    }));

    // Retornar paciente + pedidos ordenados corretamente
    res.status(200).json({ paciente, pedidos });

  } catch (err) {
    console.error("❌ Erro ao buscar detalhes do paciente:", err);
    res.status(500).json({ message: "Erro interno no servidor.", error: err.message });
  }
}

module.exports = {
  listarPacientesDashboard,
  obterDetalhesPaciente
};
