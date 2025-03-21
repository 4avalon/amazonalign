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
    email VARCHAR(255),
    cpf VARCHAR(14),
    telefone VARCHAR(20),  
    data_nascimento DATE,
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

-- =========================================
-- 1) INSERIR DENTISTAS PRIMEIRO
-- =========================================
INSERT INTO dentistas (id, nome, email, telefone, senha, data_nascimento, sexo, is_admin, is_verified)
VALUES 
  (1, 'Pedro01', 'pedro01@gmail.com', '9999-9999', '123', '1980-05-15', 'M', TRUE, TRUE),
  (2, 'Pedro02', 'pedro02@gmail.com', '8888-8888', '123', '1985-09-22', 'M', FALSE, TRUE),
  (3, 'Pedro03', 'pedro03@gmail.com', '7777-7777', '123', '1990-07-30', 'M', FALSE, TRUE),
  (4, 'Pedro04', 'pedro04@gmail.com', '6666-6666', '123', '1982-04-18', 'M', FALSE, TRUE),
  (5, 'Pedro05', 'pedro05@gmail.com', '5555-5555', '123', '1995-12-01', 'M', FALSE, FALSE);

-- =========================================
-- 2) INSERIR PACIENTES AGORA
-- =========================================
INSERT INTO pacientes (id, dentista_id, nome, cpf, telefone, data_nascimento, sexo)
VALUES
  (1, 1, 'João Silva',     '111.222.333-44', '9999-1111', '1990-05-10', 'M'),
  (2, 1, 'Mariana Lopes',  '111.999.888-77', '9999-2222', '1992-01-15', 'F'),
  (3, 2, 'Maria Souza',    '222.333.444-55', '8888-3333', '1985-08-15', 'F'),
  (4, 2, 'Carlos Lima',    '333.444.555-66', '8888-4444', '1995-02-20', 'M'),
  (5, 2, 'Carlos Lima Jr.', '332.444.555-66', '8888-5555', '1998-07-12', 'M'), 
  (6, 3, 'Fernanda Alves', '444.555.666-77', '7777-6666', '1992-06-25', 'F'),
  (7, 3, 'Gustavo Silva',  '555.666.777-88', '7777-7777', '1980-11-03', 'M'),
  (8, 4, 'Helena Castro',  '777.888.999-00', '6666-8888', '1994-07-10', 'F'),
  (9, 4, 'Ricardo Santos', '999.888.777-11', '6666-9999', '1989-10-30', 'M');


-- =========================================
-- 3) INSERIR PEDIDOS (MAIS PEDIDOS POR PACIENTE)
-- =========================================

INSERT INTO pedidos (dentista_id, paciente_id, video_conferencia, arquivo_3d, ficha_tecnica, status, data_pagamento, data_entrega)
VALUES
  (2, 3, FALSE, 'link_3d_model_maria1',  '{"procedimento":"Prótese","quantidade":2}',     'finalizado', '2024-02-20', '2024-02-25'),
  (2, 3, TRUE,  'link_3d_model_maria2',  '{"procedimento":"Clareamento","tipo":"laser"}', 'aberto', NULL, NULL),
  (2, 3, FALSE, 'link_3d_model_maria3',  '{"procedimento":"Facetas de Resina","qtd":4}',  'pago', '2024-02-15', NULL),
  (2, 3, TRUE,  'link_3d_model_maria4',  '{"procedimento":"Implante","qtd":1}',          'cancelado', NULL, NULL),
  (2, 4, TRUE,  'link_3d_model_carlos1', '{"procedimento":"Aparelho Fixo","qtd":1}',      'cancelado', NULL, NULL),
  (2, 4, FALSE, 'link_3d_model_carlos2', '{"procedimento":"Extração","dente":"siso"}',    'em_producao', NULL, NULL),
  (2, 4, TRUE,  'link_3d_model_carlos3', '{"procedimento":"Restauração","qtd":2}',       'pago', '2024-03-01', NULL),

  (3, 6, TRUE,  'link_3d_model_fernanda1','{"procedimento":"Lente de Contato","qtd":6}',  'aberto', NULL, NULL),
  (3, 6, FALSE, 'link_3d_model_fernanda2','{"procedimento":"Ortodontia","tipo":"invisível"}', 'pago', '2024-02-28', NULL),
  (3, 6, TRUE,  'link_3d_model_fernanda3','{"procedimento":"Alinhador","arco":"superior"}', 'em_producao', NULL, NULL),
  (3, 6, FALSE, 'link_3d_model_fernanda4','{"procedimento":"Facetas de porcelana","qtd":8}', 'finalizado', '2024-02-18', '2024-02-22'),
  (3, 6, TRUE,  'link_3d_model_fernanda5','{"procedimento":"Implante","qtd":2}', 'cancelado', NULL, NULL),
  (3, 7, FALSE, 'link_3d_model_gustavo1', '{"procedimento":"Extração","qtd":2}',          'pago', '2024-02-25', NULL),
  (3, 7, TRUE,  'link_3d_model_gustavo2', '{"procedimento":"Facetas de porcelana","qtd":8}', 'aberto', NULL, NULL),
  (3, 7, FALSE, 'link_3d_model_gustavo3', '{"procedimento":"Clareamento","tipo":"químico"}', 'finalizado', '2024-03-01', '2024-03-05'),
  (3, 7, TRUE,  'link_3d_model_gustavo4', '{"procedimento":"Aparelho Fixo","qtd":1}', 'em_producao', NULL, NULL),
  (3, 7, FALSE, 'link_3d_model_gustavo5', '{"procedimento":"Restauração","qtd":3}', 'pago', '2024-03-03', NULL),

  (4, 8, TRUE,  'link_3d_model_helena1', '{"procedimento":"Alinhador","arco":"inferior"}', 'em_producao', NULL, NULL),
  (4, 8, FALSE, 'link_3d_model_helena2', '{"procedimento":"Restauração","qtd":3}', 'pago', '2024-02-27', NULL),
  (4, 8, TRUE,  'link_3d_model_helena3', '{"procedimento":"Implante","qtd":1}', 'finalizado', '2024-02-22', '2024-02-28'),
  (4, 9, TRUE,  'link_3d_model_ricardo1','{"procedimento":"Implante","quantidade":2}',    'pago', '2024-02-21', NULL),
  (4, 9, FALSE, 'link_3d_model_ricardo2','{"procedimento":"Clareamento","tipo":"químico"}', 'aberto', NULL, NULL);

-- Atualizar sequência para dentistas
SELECT setval('dentistas_id_seq', (SELECT COALESCE(MAX(id), 1) FROM dentistas), false);

-- Atualizar sequência para pacientes
SELECT setval('pacientes_id_seq', (SELECT COALESCE(MAX(id), 1) FROM pacientes), false);

-- Atualizar sequência para pedidos
SELECT setval('pedidos_id_seq', (SELECT COALESCE(MAX(id), 1) FROM pedidos), false);

-- =========================================
-- 4) CONSULTAS DE VERIFICAÇÃO
-- =========================================
SELECT * FROM dentistas ORDER BY id;
SELECT * FROM pacientes ORDER BY id;
SELECT * FROM pedidos ORDER BY id;
