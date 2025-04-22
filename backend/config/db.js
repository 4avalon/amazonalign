const { Client } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

// Detecta qual URL está sendo usada
const DATABASE_URL = process.env.DATABASE_URL || process.env.DATABASE2_URL;

// Detecta se é produção (Railway) com base na URL ou no NODE_ENV
const isRailway = DATABASE_URL.includes('railway') || process.env.NODE_ENV === 'production';

// Log explicativo
console.log("🌐 Ambiente:", isRailway ? "Railway (produção)" : "Localhost (desenvolvimento)");
console.log("🔗 Banco de dados conectado:", DATABASE_URL);

const client = new Client({
  connectionString: DATABASE_URL,
  ssl: isRailway ? { rejectUnauthorized: false } : false
});

client.connect()
  .then(() => console.log('✅ Conectado ao PostgreSQL com sucesso!'))
  .catch(err => console.error('❌ Erro ao conectar ao PostgreSQL:', err));

module.exports = client;
