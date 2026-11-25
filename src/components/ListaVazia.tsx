import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icone from './Icone';

interface ListaVaziaProps {
  mensagem: string;
}

export default function ListaVazia({ mensagem }: ListaVaziaProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconeBox}>
        <Icone nome="vazio" tamanho={68} />
      </View>
      <Text style={styles.titulo}>Nenhum medicamento</Text>
      <Text style={styles.texto}>{mensagem}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 56,
    paddingHorizontal: 24,
  },
  iconeBox: {
    width: 110,
    height: 110,
    borderRadius: 28,
    backgroundColor: '#FFF1F2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#FECDD3',
    borderBottomWidth: 5,
    borderBottomColor: '#FDA4AF',
    elevation: 4,
    shadowColor: '#881337',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  titulo: {
    fontSize: 18,
    fontWeight: '700',
    color: '#881337',
    marginBottom: 6,
  },
  texto: {
    fontSize: 14,
    color: '#9F1239',
    textAlign: 'center',
    lineHeight: 20,
    opacity: 0.7,
  },
});
