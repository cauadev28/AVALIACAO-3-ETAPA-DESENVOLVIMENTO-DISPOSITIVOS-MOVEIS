export interface Medicamento {
  id: string;
  nome: string;
  dosagem: string;
  horario: string;
  tipo: 'continuo' | 'temporario' | 'urgente';
  tomado: boolean;
  foto: string | null;
  criadoEm: string;
  observacao?: string;
  notificacaoIds?: string[];
}

export interface ConfiguracaoApp {
  nomePaciente: string;
  notificacoesAtivas: boolean;
  somAtivo: boolean;
  antecedenciaMinutos: 0 | 5 | 15;
}
