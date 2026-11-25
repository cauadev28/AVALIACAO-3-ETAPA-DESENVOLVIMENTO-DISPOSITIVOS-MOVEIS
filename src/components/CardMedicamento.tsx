import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Medicamento } from '../types/Medicamento';
import Icone from './Icone';

interface CardMedicamentoProps {
  medicamento: Medicamento;
  onPress: (med: Medicamento) => void;
  onToggle: (id: string) => void;
  onExcluir: (id: string) => void;
}

export default function CardMedicamento({ medicamento, onPress, onToggle, onExcluir }: CardMedicamentoProps) {
  function corTipo() {
    if (medicamento.tipo === 'urgente') return '#E11D48';
    if (medicamento.tipo === 'temporario') return '#F59E0B';
    return '#0EA5E9';
  }

  function fundoTipo() {
    if (medicamento.tipo === 'urgente') return '#FFF1F2';
    if (medicamento.tipo === 'temporario') return '#FFFBEB';
    return '#F0F9FF';
  }

  function textoTipo() {
    if (medicamento.tipo === 'urgente') return 'Urgente';
    if (medicamento.tipo === 'temporario') return 'Temporário';
    return 'Contínuo';
  }

  return (
    <TouchableOpacity
      style={[styles.card, medicamento.tomado && styles.cardTomado]}
      onPress={() => onPress(medicamento)}
      activeOpacity={0.85}
    >
      <View style={[styles.faixaLateral, { backgroundColor: corTipo() }]} />

      <View style={styles.conteudo}>
        <View style={styles.topo}>
          <View style={[styles.badge, { backgroundColor: fundoTipo() }]}>
            <View style={[styles.ponto, { backgroundColor: corTipo() }]} />
            <Text style={[styles.badgeTexto, { color: corTipo() }]}>
              {textoTipo()}
            </Text>
          </View>

          {medicamento.tomado && (
            <View style={styles.badgeTomado}>
              <Icone nome="check" tamanho={12} cor="#059669" />
              <Text style={styles.badgeTomadoTexto}>Tomado</Text>
            </View>
          )}
        </View>

        <View style={styles.headerMed}>
          <Icone nome="pilula" tamanho={18} cor="#E11D48" />
          <Text style={[styles.nome, medicamento.tomado && styles.nomeTomado]}>
            {medicamento.nome}
          </Text>
        </View>

        <Text style={styles.dosagem}>{medicamento.dosagem}</Text>

        <View style={styles.horarioLinha}>
          <Icone nome="relogio" tamanho={14} cor="#9F1239" />
          <Text style={styles.horarioTexto}>{medicamento.horario}</Text>
        </View>

        {medicamento.foto && (
          <Image source={{ uri: medicamento.foto }} style={styles.miniatura} />
        )}

        <View style={styles.acoes}>
          <TouchableOpacity
            style={[
              styles.botaoAcao,
              medicamento.tomado ? styles.botaoDesfazer : styles.botaoTomar,
            ]}
            onPress={() => onToggle(medicamento.id)}
            activeOpacity={0.8}
          >
            <Icone
              nome={medicamento.tomado ? 'desfazer' : 'check'}
              tamanho={15}
              cor="#FFFFFF"
            />
            <Text style={styles.textoBotao}>
              {medicamento.tomado ? 'Desfazer' : 'Tomei'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.botaoAcao, styles.botaoExcluir]}
            onPress={() => onExcluir(medicamento.id)}
            activeOpacity={0.8}
          >
            <Icone nome="lixeira" tamanho={15} cor="#FFFFFF" />
            <Text style={styles.textoBotao}>Excluir</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#FECDD3',
    borderBottomWidth: 5,
    borderBottomColor: '#FDA4AF',
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#881337',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  cardTomado: {
    backgroundColor: '#FFF7F8',
    opacity: 0.85,
  },
  faixaLateral: {
    width: 6,
  },
  conteudo: {
    flex: 1,
    padding: 16,
  },
  topo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 8,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    gap: 5,
  },
  ponto: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  badgeTexto: {
    fontSize: 12,
    fontWeight: '700',
  },
  badgeTomado: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    backgroundColor: '#D1FAE5',
    gap: 4,
  },
  badgeTomadoTexto: {
    color: '#059669',
    fontSize: 12,
    fontWeight: '700',
  },
  headerMed: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 2,
  },
  nome: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1C1917',
  },
  nomeTomado: {
    textDecorationLine: 'line-through',
    color: '#A8A29E',
  },
  dosagem: {
    fontSize: 14,
    color: '#78716C',
    marginLeft: 26,
    marginBottom: 8,
  },
  horarioLinha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  horarioTexto: {
    fontSize: 13,
    color: '#9F1239',
    fontWeight: '600',
  },
  miniatura: {
    width: '100%',
    height: 130,
    borderRadius: 12,
    marginBottom: 12,
    resizeMode: 'cover',
  },
  acoes: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 4,
  },
  botaoAcao: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 12,
    gap: 6,
    borderBottomWidth: 3,
  },
  botaoTomar: {
    backgroundColor: '#E11D48',
    borderBottomColor: '#BE123C',
  },
  botaoDesfazer: {
    backgroundColor: '#78716C',
    borderBottomColor: '#57534E',
  },
  botaoExcluir: {
    backgroundColor: '#44403C',
    borderBottomColor: '#292524',
  },
  textoBotao: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
