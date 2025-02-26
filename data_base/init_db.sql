-- =========================================
-- 1) RECRIAR SCHEMA (APAGA TUDO)
-- =========================================
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;

-- =========================================
-- 2) CRIAR TABELAS
-- =========================================

CREATE TABLE IF NOT EXISTS dentistas (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    telefone VARCHAR(20),
    senha TEXT NOT NULL,
    data_nascimento DATE,  -- Adicionado
    sexo CHAR(1) CHECK (sexo IN ('M', 'F', 'O')),
    is_admin BOOLEAN DEFAULT FALSE,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS pacientes (
    id SERIAL PRIMARY KEY,
    dentista_id INTEGER NOT NULL REFERENCES dentistas(id) ON DELETE CASCADE,
    nome VARCHAR(255) NOT NULL,
    cpf VARCHAR(14) UNIQUE NOT NULL,
    telefone VARCHAR(20),  -- 📌 Adicionando o telefone do paciente
    data_nascimento DATE NOT NULL,
    sexo CHAR(1) CHECK (sexo IN ('M', 'F', 'O')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS pedidos (
    id SERIAL PRIMARY KEY,
    paciente_id INTEGER NOT NULL REFERENCES pacientes(id) ON DELETE CASCADE,
    dentista_id INTEGER NOT NULL REFERENCES dentistas(id) ON DELETE CASCADE,
    data_pagamento TIMESTAMP,
    data_entrega TIMESTAMP,
    video_conferencia BOOLEAN DEFAULT FALSE,
    arquivo_3d TEXT,
    ficha_tecnica JSONB,
    status VARCHAR(20) CHECK (
      status IN (
        'aberto', 
        'pago', 
        'em_producao', 
        'finalizado', 
        'entregue', 
        'cancelado'
      )
    ) DEFAULT 'aberto',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- (Opcional) Restaurar permissões
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;
