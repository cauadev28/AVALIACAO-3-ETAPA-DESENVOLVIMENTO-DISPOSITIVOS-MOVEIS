import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Modal,
} from 'react-native';
import Icone from './Icone';

const HORAS = Array.from({ length: 24 }, (_, i) => i);
const MINUTOS = Array.from({ length: 60 }, (_, i) => i);

interface SeletorHorarioProps {
  horarios: string[];
  onChange: (horarios: string[]) => void;
}

const ITEM_HEIGHT = 46;

export default function SeletorHorario({ horarios, onChange }: SeletorHorarioProps) {
  const [modalVisivel, setModalVisivel] = useState(false);
  const [horaSelecionada, setHoraSelecionada] = useState(8);
  const [minutoSelecionado, setMinutoSelecionado] = useState(0);
  const refMinutos = useRef<FlatList>(null);

  function formatarHorario(h: number, m: number): string {
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  }

  function adicionarHorario() {
    const novo = formatarHorario(horaSelecionada, minutoSelecionado);
    if (!horarios.includes(novo)) {
      onChange([...horarios, novo].sort());
    }
    setModalVisivel(false);
  }

  function removerHorario(h: string) {
    onChange(horarios.filter((x) => x !== h));
  }

  return (
    <View>
      {horarios.length === 0 ? (
        <View style={styles.vazio}>
          <Icone nome="relogio" tamanho={20} cor="#D4A0A0" />
          <Text style={styles.vazioTexto}>Nenhum horário adicionado</Text>
        </View>
      ) : (
        <View style={styles.chips}>
          {horarios.map((h) => (
            <View key={h} style={styles.chip}>
              <Icone nome="relogio" tamanho={14} cor="#E11D48" />
              <Text style={styles.chipTexto}>{h}</Text>
              <TouchableOpacity
                onPress={() => removerHorario(h)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Icone nome="mais" tamanho={14} cor="#BE123C" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      <TouchableOpacity
        style={styles.botaoAdicionar}
        onPress={() => setModalVisivel(true)}
        activeOpacity={0.85}
      >
        <Icone nome="mais" tamanho={18} cor="#E11D48" />
        <Text style={styles.botaoAdicionarTexto}>Adicionar horário</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisivel}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisivel(false)}
      >
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitulo}>Escolha o horário</Text>

            <View style={styles.pickersRow}>
              <View style={styles.pickerCol}>
                <Text style={styles.pickerLabel}>HORA</Text>
                <FlatList
                  data={HORAS}
                  keyExtractor={(item) => String(item)}
                  style={styles.pickerScroll}
                  showsVerticalScrollIndicator={false}
                  getItemLayout={(_, index) => ({
                    length: ITEM_HEIGHT,
                    offset: ITEM_HEIGHT * index,
                    index,
                  })}
                  initialScrollIndex={Math.max(0, horaSelecionada - 2)}
                  renderItem={({ item: h }) => (
                    <TouchableOpacity
                      style={[
                        styles.pickerItem,
                        horaSelecionada === h && styles.pickerItemAtivo,
                      ]}
                      onPress={() => setHoraSelecionada(h)}
                      activeOpacity={0.8}
                    >
                      <Text
                        style={[
                          styles.pickerTexto,
                          horaSelecionada === h && styles.pickerTextoAtivo,
                        ]}
                      >
                        {String(h).padStart(2, '0')}h
                      </Text>
                    </TouchableOpacity>
                  )}
                />
              </View>

              <View style={styles.pickerSeparador}>
                <Text style={styles.pickerSepTexto}>:</Text>
              </View>

              <View style={styles.pickerCol}>
                <Text style={styles.pickerLabel}>MIN</Text>
                <FlatList
                  ref={refMinutos}
                  data={MINUTOS}
                  keyExtractor={(item) => String(item)}
                  style={styles.pickerScroll}
                  showsVerticalScrollIndicator={false}
                  getItemLayout={(_, index) => ({
                    length: ITEM_HEIGHT,
                    offset: ITEM_HEIGHT * index,
                    index,
                  })}
                  initialScrollIndex={Math.max(0, minutoSelecionado - 2)}
                  renderItem={({ item: m }) => (
                    <TouchableOpacity
                      style={[
                        styles.pickerItem,
                        minutoSelecionado === m && styles.pickerItemAtivo,
                      ]}
                      onPress={() => setMinutoSelecionado(m)}
                      activeOpacity={0.8}
                    >
                      <Text
                        style={[
                          styles.pickerTexto,
                          minutoSelecionado === m && styles.pickerTextoAtivo,
                        ]}
                      >
                        {String(m).padStart(2, '0')}
                      </Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            </View>

            <View style={styles.previewBox}>
              <Icone nome="relogio" tamanho={16} cor="#E11D48" />
              <Text style={styles.previewTexto}>
                {formatarHorario(horaSelecionada, minutoSelecionado)}
              </Text>
            </View>

            <View style={styles.modalBotoes}>
              <TouchableOpacity
                style={styles.botaoCancelar}
                onPress={() => setModalVisivel(false)}
                activeOpacity={0.8}
              >
                <Text style={styles.botaoCancelarTexto}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.botaoConfirmar}
                onPress={adicionarHorario}
                activeOpacity={0.85}
              >
                <Icone nome="check" tamanho={16} cor="#FFFFFF" />
                <Text style={styles.botaoConfirmarTexto}>Adicionar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  vazio: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#FFF7F8',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#FECDD3',
    borderBottomWidth: 3,
    marginBottom: 10,
  },
  vazioTexto: {
    color: '#D4A0A0',
    fontSize: 15,
    fontStyle: 'italic',
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 10,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFF1F2',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderWidth: 1,
    borderColor: '#FECDD3',
    borderBottomWidth: 3,
    borderBottomColor: '#FDA4AF',
  },
  chipTexto: {
    fontSize: 15,
    fontWeight: '800',
    color: '#881337',
  },
  botaoAdicionar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FFF1F2',
    borderRadius: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#FECDD3',
    borderBottomWidth: 3,
    borderBottomColor: '#FDA4AF',
    borderStyle: 'dashed',
  },
  botaoAdicionarTexto: {
    fontSize: 15,
    fontWeight: '700',
    color: '#E11D48',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(136, 19, 55, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    width: '100%',
    borderBottomWidth: 6,
    borderBottomColor: '#FDA4AF',
    elevation: 10,
    shadowColor: '#881337',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
  },
  modalTitulo: {
    fontSize: 20,
    fontWeight: '800',
    color: '#881337',
    textAlign: 'center',
    marginBottom: 20,
  },
  pickersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 16,
  },
  pickerCol: {
    flex: 1,
    alignItems: 'center',
  },
  pickerLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#9F1239',
    letterSpacing: 1,
    marginBottom: 8,
  },
  pickerScroll: {
    height: 180,
    width: '100%',
  },
  pickerItem: {
    height: ITEM_HEIGHT,
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  pickerItemAtivo: {
    backgroundColor: '#E11D48',
  },
  pickerTexto: {
    fontSize: 20,
    fontWeight: '700',
    color: '#78716C',
  },
  pickerTextoAtivo: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  pickerSeparador: {
    paddingTop: 24,
  },
  pickerSepTexto: {
    fontSize: 28,
    fontWeight: '800',
    color: '#881337',
  },
  previewBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FFF1F2',
    borderRadius: 14,
    paddingVertical: 12,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#FECDD3',
    borderBottomWidth: 3,
    borderBottomColor: '#FDA4AF',
  },
  previewTexto: {
    fontSize: 24,
    fontWeight: '800',
    color: '#881337',
  },
  modalBotoes: {
    flexDirection: 'row',
    gap: 10,
  },
  botaoCancelar: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: '#FFF7F8',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FECDD3',
    borderBottomWidth: 3,
    borderBottomColor: '#FDA4AF',
  },
  botaoCancelarTexto: {
    fontSize: 15,
    fontWeight: '700',
    color: '#9F1239',
  },
  botaoConfirmar: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: '#E11D48',
    borderBottomWidth: 4,
    borderBottomColor: '#881337',
  },
  botaoConfirmarTexto: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
