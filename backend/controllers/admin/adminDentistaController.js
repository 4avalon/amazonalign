// controllers/admin/adminDentistaController.js
const client = require("../../config/db");

// 1) Listar dentistas para o Dashboard Admin
async function listarDentistasDashboard(req, res) {
    console.log("📋 Requisição: Listar dentistas para o Dashboard Admin");
    try {
        const result = await client.query(`
            SELECT 
                d.id, 
                d.nome, 
                d.is_admin::BOOLEAN AS is_admin,
                d.is_verified::BOOLEAN AS is_verified,
                COALESCE(COUNT(p.id), 0) AS total_pedidos,
                COALESCE(SUM(CASE WHEN p.status NOT IN ('Concluído', 'Cancelado') THEN 1 ELSE 0 END), 0) AS pedidos_abertos
            FROM dentistas d
            LEFT JOIN pedidos p ON d.id = p.dentista_id
            GROUP BY d.id
            ORDER BY d.id ASC
        `);
        res.status(200).json(result.rows);
    } catch (err) {
        console.error("❌ Erro ao listar dentistas para o dashboard:", err);
        res.status(500).json({ message: "Erro interno no servidor." });
    }
}

// 2) Detalhes de um dentista específico
async function obterDetalhesDentista(req, res) {
    const { id } = req.params;
    console.log(`🔍 Buscando detalhes do dentista ID=${id}`);
    try {
        const result = await client.query(`
            SELECT d.id, d.nome, d.email, d.telefone, d.is_admin, d.is_verified, 
                COUNT(p.id) AS total_pedidos,
                COUNT(CASE WHEN p.status NOT IN ('Concluído', 'Cancelado') THEN 1 END) AS pedidos_abertos
            FROM dentistas d
            LEFT JOIN pedidos p ON d.id = p.dentista_id
            WHERE d.id = $1
            GROUP BY d.id
        `, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Dentista não encontrado." });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error("❌ Erro ao buscar detalhes do dentista:", error);
        res.status(500).json({ message: "Erro ao buscar detalhes do dentista." });
    }
}

// 3) Alternar Status de Administrador
async function alternarAdmin(req, res) {
    const { id } = req.params;
    console.log(`🔄 Alternando status de Admin para dentista ID=${id}`);
    try {
        const result = await client.query("SELECT is_admin FROM dentistas WHERE id = $1", [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Dentista não encontrado." });
        }
        const novoStatus = !result.rows[0].is_admin;
        const updateResult = await client.query(
            "UPDATE dentistas SET is_admin = $1 WHERE id = $2 RETURNING is_admin",
            [novoStatus, id]
        );
        res.status(200).json({ message: "Status de Administrador atualizado com sucesso!", is_admin: updateResult.rows[0].is_admin });
    } catch (err) {
        console.error("❌ Erro ao alternar status de Admin:", err);
        res.status(500).json({ message: "Erro ao atualizar status de administrador." });
    }
}

// 4) Alternar Status de Credenciado
async function alternarCredenciado(req, res) {
    const { id } = req.params;
    console.log(`🔄 Alternando status de Credenciado para dentista ID=${id}`);
    try {
        const result = await client.query("SELECT is_verified FROM dentistas WHERE id = $1", [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Dentista não encontrado." });
        }
        const novoStatus = !result.rows[0].is_verified;
        const updateResult = await client.query(
            "UPDATE dentistas SET is_verified = $1 WHERE id = $2 RETURNING is_verified",
            [novoStatus, id]
        );
        res.status(200).json({ message: "Status de Credenciado atualizado com sucesso!", is_verified: updateResult.rows[0].is_verified });
    } catch (err) {
        console.error("❌ Erro ao alternar status de Credenciado:", err);
        res.status(500).json({ message: "Erro ao atualizar status de credenciamento." });
    }
}

module.exports = {
    listarDentistasDashboard,
    obterDetalhesDentista,
    alternarAdmin,
    alternarCredenciado
};
