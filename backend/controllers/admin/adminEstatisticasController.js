// controllers/admin/adminEstatisticasController.js
const client = require("../../config/db");

async function obterEstatisticasAdmin(req, res) {
    console.log("📊 Obtendo estatísticas do dashboard Admin...");
    try {
        const result = await client.query(`
            SELECT 
                (SELECT COUNT(*) FROM dentistas) AS total_dentistas,
                (SELECT COUNT(*) FROM pacientes) AS total_pacientes,
                (SELECT COUNT(*) FROM pedidos) AS total_pedidos,
                (SELECT COUNT(*) FROM pedidos WHERE status NOT IN ('Concluído', 'Cancelado')) AS pedidos_abertos,
                (SELECT COUNT(*) FROM pedidos WHERE status = 'Concluído') AS pedidos_finalizados,
                (SELECT COUNT(*) FROM pedidos WHERE status = 'Cancelado') AS pedidos_cancelados,
                (SELECT COUNT(*) FROM dentistas WHERE is_verified = TRUE) AS total_dentistas_credenciados,
                (SELECT COUNT(*) FROM pedidos WHERE created_at >= NOW() - INTERVAL '7 days') AS pedidos_ultimos_7_dias,
                (SELECT COUNT(*) FROM dentistas WHERE is_verified = TRUE AND created_at >= NOW() - INTERVAL '7 days') AS dentistas_credenciados_7_dias,
                (SELECT COUNT(*) FROM pedidos WHERE DATE_TRUNC('month', created_at) = DATE_TRUNC('month', CURRENT_DATE)) AS pedidos_mes_atual,
                (SELECT COUNT(*) FROM dentistas WHERE is_verified = TRUE AND DATE_TRUNC('month', created_at) = DATE_TRUNC('month', CURRENT_DATE)) AS dentistas_credenciados_mes_atual
        `);
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error("❌ Erro ao buscar estatísticas do Admin:", error);
        res.status(500).json({ message: "Erro ao buscar estatísticas do Admin." });
    }
}

module.exports = {
    obterEstatisticasAdmin
};
