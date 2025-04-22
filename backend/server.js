const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Carregar variáveis de ambiente
dotenv.config();



const dentistasRoutes = require('./routes/dentistas');
const pacientesRoutes = require('./routes/pacientes');
const pedidosRoutes = require('./routes/pedidos');
//novas rotas
const dashboardAdminRoutes = require("./routes/dashboardAdmin");
const dashboardDentistaRoutes = require("./routes/dashboardDentista");



const app = express();

// Configurações básicas
// Configurações básicas
app.use(cors({
  origin: '*', // Libera geral — depois pode restringir se quiser
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.options('*', cors()); // 🔥 Isso resolve os erros de CORS pré-flight

app.use(express.json());


// Rotas
app.use('/dentistas', dentistasRoutes);
app.use('/pacientes', pacientesRoutes);
app.use('/pedidos', pedidosRoutes);
// Rotas do Admin Dashboard
app.use("/admin", dashboardAdminRoutes);


app.use("/dentista", dashboardDentistaRoutes);




// Inicialização do servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ 777 Servidor rodando na porta ${PORT}`);
});


