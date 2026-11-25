import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Icone from '../components/Icone';
import { carregarMedicamentos } from '../storage/medStorage';
import { Medicamento } from '../types/Medicamento';

export default function TelaSobre() {
  const [medicamentos, setMedicamentos] = useState<Medicamento[]>([]);

  useFocusEffect(
    useCallback(() => {
      carregarMedicamentos().then(setMedicamentos);
    }, [])
  );

  const total = medicamentos.length;
  const tomados = medicamentos.filter((m) => m.tomado).length;
  const pendentes = total - tomados;
  const urgentes = medicamentos.filter((m) => m.tipo === 'urgente' && !m.tomado).length;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollConteudo}>
      <View style={styles.header}>
        <View style={styles.headerLogo}>
          <Icone nome="coracao" tamanho={24} cor="#FB7185" />
          <Text style={styles.appNome}>CUIDAMED</Text>
        </View>
        <Text style={styles.headerTitulo}>Resumo e Informações</Text>
        <Text style={styles.headerSubtitulo}>Controle de Medicamentos</Text>
      </View>

      <View style={styles.cardContainer}>
        <View style={[styles.statCard, { backgroundColor: '#E11D48', borderBottomColor: '#881337' }]}>
          <Icone nome="pilula" tamanho={24} cor="#FFFFFF" />
          <Text style={styles.statNumero}>{total}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: '#059669', borderBottomColor: '#047857' }]}>
          <Icone nome="check" tamanho={24} cor="#FFFFFF" />
          <Text style={styles.statNumero}>{tomados}</Text>
          <Text style={styles.statLabel}>Tomados</Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: '#F59E0B', borderBottomColor: '#D97706' }]}>
          <Icone nome="relogio" tamanho={24} cor="#FFFFFF" />
          <Text style={styles.statNumero}>{pendentes}</Text>
          <Text style={styles.statLabel}>Pendentes</Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: '#DC2626', borderBottomColor: '#991B1B' }]}>
          <Icone nome="alerta" tamanho={24} cor="#FFFFFF" />
          <Text style={styles.statNumero}>{urgentes}</Text>
          <Text style={styles.statLabel}>Urgentes</Text>
        </View>
      </View>

      <View style={styles.infoBox}>
        <View style={styles.infoHeader}>
          <Icone nome="coracao" tamanho={20} cor="#E11D48" />
          <Text style={styles.infoTitulo}>Sobre o aplicativo</Text>
        </View>
        <Text style={styles.infoTexto}>
          O CuidaMed foi criado como projeto final da disciplina de Desenvolvimento para Dispositivos Móveis. Ele ajuda no controle diário de medicamentos, evitando esquecimentos e confusões com dosagens.
        </Text>
        <Text style={styles.infoTexto}>
          Tecnologias utilizadas: React Native, Expo, TypeScript, AsyncStorage e Expo Image Picker.
        </Text>
        <Text style={styles.versao}>Versão 1.0.0</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF1F2',
  },
  scrollConteudo: {
    paddingBottom: 30,
  },
  header: {
    backgroundColor: '#881337',
    paddingTop: 52,
    paddingBottom: 26,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    elevation: 8,
    shadowColor: '#881337',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  headerLogo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  appNome: {
    color: '#FDA4AF',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 2,
  },
  headerTitulo: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '800',
  },
  headerSubtitulo: {
    color: '#FDA4AF',
    fontSize: 14,
    marginTop: 4,
  },
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 12,
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    borderRadius: 18,
    padding: 18,
    alignItems: 'center',
    borderBottomWidth: 5,
    elevation: 5,
    shadowColor: '#881337',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  statNumero: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '800',
    marginTop: 6,
  },
  statLabel: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 2,
    opacity: 0.95,
  },
  infoBox: {
    marginHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#FECDD3',
    borderBottomWidth: 5,
    borderBottomColor: '#FDA4AF',
    elevation: 4,
    shadowColor: '#881337',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  infoTitulo: {
    fontSize: 18,
    fontWeight: '800',
    color: '#881337',
  },
  infoTexto: {
    fontSize: 14,
    color: '#57534E',
    lineHeight: 22,
    marginBottom: 8,
  },
  versao: {
    fontSize: 13,
    fontWeight: '600',
    color: '#A8A29E',
    marginTop: 8,
  },
});
