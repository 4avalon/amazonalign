const express = require('express');
const router = express.Router();

const {
  listarPedidos,
  listarPedidosEmAberto,
  adicionarPedido,
  removerPedido,
  buscarPedidoPorId,
  atualizarFichaTecnica,
} = require('../controllers/pedidoController');

const { autenticarToken, autenticarAdmin, autenticarDentista } = require("../middlewares/auth");

// nova função que deixa passar se for admin ou dentista
const autenticarAdminOuDentista = (req, res, next) => {
  if (req.usuario?.is_admin || req.usuario?.id) {
    return next();
  }
  return res.status(403).json({ message: "Acesso negado. Somente administradores ou dentistas." });
};


// 🔒 Todas as rotas exigem token
// ➕ Administradores e dentistas têm permissões distintas

// 📦 Listar todos os pedidos (acesso apenas para admin)
router.get('/', autenticarToken, autenticarAdmin, listarPedidos);

// 📦 Listar pedidos em aberto (admin)
router.get('/abertos', autenticarToken, autenticarAdmin, listarPedidosEmAberto);

// ➕ Criar novo pedido (dentista)
router.post('/', autenticarToken, autenticarDentista, adicionarPedido);

// ❌ Remover pedido (dentista)
router.delete('/:id', autenticarToken, autenticarDentista, removerPedido);

// 📄 Buscar pedido por ID (admin OU dentista)
router.get('/:id', autenticarToken, autenticarAdminOuDentista, buscarPedidoPorId);

// ✏️ Atualizar ficha técnica (dentista)
router.put('/:id', autenticarToken, autenticarDentista, atualizarFichaTecnica);

module.exports = router;
