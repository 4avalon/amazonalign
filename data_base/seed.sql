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

  INSERT INTO pedidos (dentista_id, paciente_id, video_conferencia, arquivo_3d, ficha_tecnica, status)
VALUES
  (2, 3, FALSE, 'link_3d_model_maria1',  '{"procedimento":"Prótese","quantidade":2}',     'finalizado'),
  (2, 3, TRUE,  'link_3d_model_maria2',  '{"procedimento":"Clareamento","tipo":"laser"}', 'aberto'),
  (2, 3, FALSE, 'link_3d_model_maria3',  '{"procedimento":"Facetas de Resina","qtd":4}',  'pago'),
  (2, 3, TRUE,  'link_3d_model_maria4',  '{"procedimento":"Implante","qtd":1}',          'cancelado'),
  (2, 4, TRUE,  'link_3d_model_carlos1', '{"procedimento":"Aparelho Fixo","qtd":1}',      'cancelado'),
  (2, 4, FALSE, 'link_3d_model_carlos2', '{"procedimento":"Extração","dente":"siso"}',    'em_producao'),
  (2, 4, TRUE,  'link_3d_model_carlos3', '{"procedimento":"Restauração","qtd":2}',       'pago'),

  (3, 6, TRUE,  'link_3d_model_fernanda1','{"procedimento":"Lente de Contato","qtd":6}',  'aberto'),
  (3, 6, FALSE, 'link_3d_model_fernanda2','{"procedimento":"Ortodontia","tipo":"invisível"}', 'pago'),
  (3, 6, TRUE,  'link_3d_model_fernanda3','{"procedimento":"Alinhador","arco":"superior"}', 'em_producao'),
  (3, 6, FALSE, 'link_3d_model_fernanda4','{"procedimento":"Facetas de porcelana","qtd":8}', 'finalizado'),
  (3, 6, TRUE,  'link_3d_model_fernanda5','{"procedimento":"Implante","qtd":2}', 'cancelado'),
  (3, 7, FALSE, 'link_3d_model_gustavo1', '{"procedimento":"Extração","qtd":2}',          'pago'),
  (3, 7, TRUE,  'link_3d_model_gustavo2', '{"procedimento":"Facetas de porcelana","qtd":8}', 'aberto'),
  (3, 7, FALSE, 'link_3d_model_gustavo3', '{"procedimento":"Clareamento","tipo":"químico"}', 'finalizado'),
  (3, 7, TRUE,  'link_3d_model_gustavo4', '{"procedimento":"Aparelho Fixo","qtd":1}', 'em_producao'),
  (3, 7, FALSE, 'link_3d_model_gustavo5', '{"procedimento":"Restauração","qtd":3}', 'pago'),

  (4, 8, TRUE,  'link_3d_model_helena1', '{"procedimento":"Alinhador","arco":"inferior"}', 'em_producao'),
  (4, 8, FALSE, 'link_3d_model_helena2', '{"procedimento":"Restauração","qtd":3}', 'pago'),
  (4, 8, TRUE,  'link_3d_model_helena3', '{"procedimento":"Implante","qtd":1}', 'finalizado'),
  (4, 9, TRUE,  'link_3d_model_ricardo1','{"procedimento":"Implante","quantidade":2}',    'pago'),
  (4, 9, FALSE, 'link_3d_model_ricardo2','{"procedimento":"Clareamento","tipo":"químico"}', 'aberto');


-- =========================================
-- 4) CONSULTAS DE VERIFICAÇÃO
-- =========================================
SELECT * FROM dentistas ORDER BY id;
SELECT * FROM pacientes ORDER BY id;
SELECT * FROM pedidos ORDER BY id;
