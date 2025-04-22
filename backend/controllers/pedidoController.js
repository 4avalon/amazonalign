const client = require('../config/db');

// 🔹 Listar todos os pedidos (ADMIN)
const listarPedidos = async (req, res) => {
  console.log('📋 Listando todos os pedidos (admin).');
  try {
    const result = await client.query('SELECT * FROM pedidos');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('❌ Erro ao listar pedidos:', err);
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
};

// 🔹 Listar pedidos em aberto (ADMIN)
const listarPedidosEmAberto = async (req, res) => {
  console.log('📋 Listando pedidos em aberto (admin).');
  try {
    const result = await client.query(
      `SELECT * FROM pedidos WHERE status NOT IN ('Concluído', 'Cancelado') ORDER BY data_pagamento DESC`
    );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('❌ Erro ao listar pedidos em aberto:', err);
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
};

// 🔹 Adicionar novo pedido (DENTISTA)
const adicionarPedido = async (req, res) => {
  console.log('➕ Adicionando pedido:', req.body);

  const {
    paciente_id,
    descricao,
    status = 'aberto',
    ficha_tecnica
  } = req.body;

  const dentista_id = req.usuario?.id; // ← vem do token

  if (!dentista_id) {
    return res.status(403).json({ message: 'ID do dentista ausente (token).' });
  }

  try {
    const result = await client.query(
      `INSERT INTO pedidos (paciente_id, dentista_id, descricao, status, ficha_tecnica)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [paciente_id, dentista_id, descricao, status, ficha_tecnica]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('❌ Erro ao adicionar pedido:', err);
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
};

// 🔹 Remover pedido (DENTISTA)
const removerPedido = async (req, res) => {
  const { id } = req.params;
  const dentista_id = req.usuario?.id;

  console.log(`🗑️ Tentando remover pedido ID=${id}`);

  try {
    const check = await client.query('SELECT status, dentista_id FROM pedidos WHERE id = $1', [id]);

    if (!check.rows.length) {
      return res.status(404).json({ message: 'Pedido não encontrado.' });
    }

    const { status, dentista_id: dono } = check.rows[0];

    if (dono !== dentista_id) {
      return res.status(403).json({ message: 'Acesso negado: você não é o dono deste pedido.' });
    }

    if (status !== 'aberto') {
      return res.status(400).json({ message: 'Só é possível excluir pedidos com status ABERTO.' });
    }

    await client.query('DELETE FROM pedidos WHERE id = $1', [id]);

    res.status(200).json({ message: '✅ Pedido removido com sucesso.' });
  } catch (err) {
    console.error('❌ Erro ao remover pedido:', err);
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
};

// 🔹 Buscar pedido por ID (ADMIN ou DENTISTA)
const buscarPedidoPorId = async (req, res) => {
  const { id } = req.params;
  const usuario = req.usuario;

  try {
    const result = await client.query(
      `SELECT p.*, d.nome AS dentista_nome, pa.nome AS paciente_nome
       FROM pedidos p
       JOIN dentistas d ON d.id = p.dentista_id
       JOIN pacientes pa ON pa.id = p.paciente_id
       WHERE p.id = $1`,
      [id]
    );

    if (!result.rows.length) {
      return res.status(404).json({ message: "Pedido não encontrado" });
    }

    const pedido = result.rows[0];

    if (!usuario.is_admin && usuario.id !== pedido.dentista_id) {
      return res.status(403).json({ message: "Acesso negado: você não é o dono do pedido." });
    }

    res.status(200).json(pedido);
  } catch (error) {
    console.error('❌ Erro ao buscar pedido por ID:', error);
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
};

// 🔹 Atualizar ficha técnica (DENTISTA)
const atualizarFichaTecnica = async (req, res) => {
  const { id } = req.params;
  const { ficha_tecnica } = req.body;
  const dentista_id = req.usuario?.id;

  if (!ficha_tecnica) {
    return res.status(400).json({ message: 'Ficha técnica ausente.' });
  }

  try {
    const check = await client.query('SELECT dentista_id FROM pedidos WHERE id = $1', [id]);

    if (!check.rows.length || check.rows[0].dentista_id !== dentista_id) {
      return res.status(403).json({ message: 'Acesso negado ou pedido inexistente.' });
    }

    const result = await client.query(
      'UPDATE pedidos SET ficha_tecnica = $1 WHERE id = $2 RETURNING *',
      [ficha_tecnica, id]
    );

    res.status(200).json({ message: 'Ficha técnica atualizada com sucesso.', pedido: result.rows[0] });
  } catch (error) {
    console.error('❌ Erro ao atualizar ficha técnica:', error);
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
};

module.exports = {
  listarPedidos,
  listarPedidosEmAberto,
  adicionarPedido,
  removerPedido,
  buscarPedidoPorId,
  atualizarFichaTecnica
};
