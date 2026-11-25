export interface Medicamento {
  id: string;
  nome: string;
  dosagem: string;
  horario: string;
  tipo: 'continuo' | 'temporario' | 'urgente';
  tomado: boolean;
  foto: string | null;
  criadoEm: string;
  notificacaoIds?: string[];
}
