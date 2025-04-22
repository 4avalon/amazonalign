//console.log("[Paciente Dentista] 🔥 Script paciente_dentista.js carregado corretamente!");

// Importando funções essenciais dos módulos
import { inicializarTabelaPacientes } from "./pacientes_dentista/tabela_pacientes.js";
import { carregarDadosDentista } from "./pacientes_dentista/detalhes_paciente.js";
import { configurarDetalhesPaciente } from "./pacientes_dentista/detalhes_paciente.js";
import { inicializarTabelaPedidosPaciente } from "./pacientes_dentista/tabela_pedidos_paciente.js";

// Inicializa as tabelas
inicializarTabelaPacientes();
carregarDadosDentista(); // 🔹 Atualiza o nome do dentista logado
configurarDetalhesPaciente(); // 🔹 Carrega os pacientes no dropdown e preenche os detalhes
inicializarTabelaPedidosPaciente(); // 🔹 Inicializa a tabela de pedidos
