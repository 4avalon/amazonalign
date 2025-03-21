const client = require('../config/db'); // Conexão com o banco de dados

// Listar todos os pacientes
const listarPacientes = async (req, res) => {
  console.log('📋 Requisição: Listar todos os pacientes.');
  try {
    const result = await client.query('SELECT * FROM pacientes');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('❌ Erro ao listar pacientes:', err);
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
};

// Adicionar um novo paciente
const adicionarPaciente = async (req, res) => {
  const { nome, dentista_id, email, telefone, cpf, data_nascimento, sexo } = req.body;

  // Verifica apenas os campos obrigatórios
  if (!nome || !dentista_id) {
    return res.status(400).json({ message: "Nome e dentista_id são obrigatórios." });
  }

  try {
    const result = await client.query(
      `INSERT INTO pacientes (nome, dentista_id, email, telefone, cpf, data_nascimento, sexo) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [
        nome,
        dentista_id,
        email || null,          // Se não informado, salva como NULL
        telefone || null,
        cpf || null,
        data_nascimento || null,
        sexo || null,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("❌ Erro ao adicionar paciente:", err);
    res.status(500).json({ message: "Erro interno no servidor." });
  }
};



// Remover um paciente
const removerPaciente = async (req, res) => {
  const { id } = req.params;
  console.log(`🗑️ Requisição: Remover paciente com ID=${id}`);

  try {
    const result = await client.query('DELETE FROM pacientes WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      console.log('❌ Paciente não encontrado.');
      return res.status(404).json({ message: 'Paciente não encontrado.' });
    }
    res.status(200).json({ message: 'Paciente removido com sucesso.', paciente: result.rows[0] });
  } catch (err) {
    console.error('❌ Erro ao remover paciente:', err);
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
};

module.exports = {
  listarPacientes,
  adicionarPaciente,
  removerPaciente,
};
