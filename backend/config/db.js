const { Client } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

client.connect()
  .then(() => console.log('✅ Conectado ao PostgreSQL com sucesso!'))
  .catch(err => console.error('❌ Erro ao conectar ao PostgreSQL:', err));

module.exports = client;
