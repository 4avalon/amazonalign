 console.log(`🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄'`);
// controllers/admin/adminPedidoController.js
const client = require("../../config/db");

// Lista todos os pedidos para o Dashboard Admin
async function listarPedidosDashboard(req, res) {
    console.log("📦 Requisição: Listar pedidos para o Dashboard Admin");
    try {
        const result = await client.query(`
            SELECT 
                p.id, 
                p.paciente_id, 
                CONCAT(pa.nome, ' (ID: ', pa.id, ')') AS paciente_nome, 
                p.dentista_id, 
                CONCAT(d.nome, ' (ID: ', d.id, ')') AS dentista_nome, 
                p.data_pagamento, 
                p.video_conferencia, 
                p.arquivo_3d, 
                p.ficha_tecnica, 
                p.status, 
                p.created_at
            FROM pedidos p
            JOIN dentistas d ON p.dentista_id = d.id
            JOIN pacientes pa ON p.paciente_id = pa.id
            ORDER BY p.created_at DESC
        `);
        res.status(200).json(result.rows);
    } catch (err) {
        console.error("❌ Erro ao listar pedidos para o dashboard:", err);
        res.status(500).json({ message: "Erro interno no servidor." });
    }
}

// Alterar Status de um Pedido
async function alterarStatusPedido(req, res) {
    const { id } = req.params;
    const { status } = req.body;
    console.log(`🔄 Atualizando status do pedido ID=${id} para '${status}'`);

    const statusPermitidos = ["Pendente", "Em andamento", "Aprovado", "Concluído", "Cancelado"];
    if (!statusPermitidos.includes(status)) {
        return res.status(400).json({ message: `Status inválido. Os status permitidos são: ${statusPermitidos.join(", ")}` });
    }

    try {
        const pedidoExiste = await client.query("SELECT id FROM pedidos WHERE id = $1", [id]);
        if (pedidoExiste.rows.length === 0) {
            return res.status(404).json({ message: "Pedido não encontrado." });
        }
        await client.query(
            "UPDATE pedidos SET status = $1 WHERE id = $2 RETURNING id, dentista_id, paciente_id, status",
            [status, id]
        );
        console.log(`✅ Status do pedido ID=${id} atualizado para '${status}'`);
        res.status(200).json({ message: "Status do pedido atualizado com sucesso!", pedido: { id, status } });
    } catch (error) {
        console.error("❌ Erro ao atualizar status do pedido:", error);
        res.status(500).json({ message: "Erro interno no servidor." });
    }
}

module.exports = {
    listarPedidosDashboard,
    alterarStatusPedido
};

