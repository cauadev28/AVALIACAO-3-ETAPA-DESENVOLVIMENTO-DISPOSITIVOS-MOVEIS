import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useRoute, useNavigation, useFocusEffect, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icone from '../components/Icone';
import { Medicamento } from '../types/Medicamento';
import { carregarMedicamentos } from '../storage/medStorage';

type RootStackParamList = {
  HomeTabs: undefined;
  Cadastro: { medicamento?: Medicamento };
  Detalhes: { medicamento: Medicamento };
};

type DetalhesRouteProp = RouteProp<RootStackParamList, 'Detalhes'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function TelaDetalhes() {
  const route = useRoute<DetalhesRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const [med, setMed] = useState<Medicamento>(route.params.medicamento);

  useFocusEffect(
    useCallback(() => {
      async function atualizar() {
        const todos = await carregarMedicamentos();
        const encontrado = todos.find((m) => m.id === route.params.medicamento.id);
        if (encontrado) {
          setMed(encontrado);
        }
      }
      atualizar();
    }, [route.params.medicamento.id])
  );

  function corTipo() {
    if (med.tipo === 'urgente') return '#E11D48';
    if (med.tipo === 'temporario') return '#F59E0B';
    return '#0EA5E9';
  }

  function editarMed() {
    navigation.navigate('Cadastro', { medicamento: med });
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.conteudo}>
      <View style={styles.card}>
        <View style={styles.statusContainer}>
          <View style={[styles.badge, { backgroundColor: corTipo() }]}>
            <Text style={styles.badgeTexto}>
              {med.tipo === 'urgente'
                ? 'Urgente'
                : med.tipo === 'temporario'
                ? 'Temporário'
                : 'Contínuo'}
            </Text>
          </View>
          <View
            style={[
              styles.badge,
              { backgroundColor: med.tomado ? '#059669' : '#78716C' },
            ]}
          >
            <Icone
              nome={med.tomado ? 'check' : 'relogio'}
              tamanho={13}
              cor="#FFFFFF"
            />
            <Text style={styles.badgeTexto}>
              {med.tomado ? 'Tomado' : 'Pendente'}
            </Text>
          </View>
        </View>

        <View style={styles.nomeHeader}>
          <Icone nome="pilula" tamanho={22} cor="#E11D48" />
          <Text style={styles.nome}>{med.nome}</Text>
        </View>

        <Text style={styles.labelSecao}>Dosagem</Text>
        <Text style={styles.descricao}>{med.dosagem}</Text>

        <View style={styles.datasRow}>
          <View style={styles.dataBox}>
            <View style={styles.dataHeader}>
              <Icone nome="relogio" tamanho={14} cor="#E11D48" />
              <Text style={styles.dataLabel}>Horário</Text>
            </View>
            <Text style={styles.dataValor}>{med.horario}</Text>
          </View>

          <View style={styles.dataBox}>
            <View style={styles.dataHeader}>
              <Icone nome="coracao" tamanho={14} cor="#E11D48" />
              <Text style={styles.dataLabel}>Cadastrado em</Text>
            </View>
            <Text style={styles.dataValor}>{med.criadoEm}</Text>
          </View>
        </View>

        {med.foto && (
          <>
            <Text style={styles.labelSecao}>Foto da caixa / receita</Text>
            <Image source={{ uri: med.foto }} style={styles.imagem} />
          </>
        )}
      </View>

      <TouchableOpacity style={styles.botaoEditar} onPress={editarMed} activeOpacity={0.85}>
        <Icone nome="editar" tamanho={18} cor="#FFFFFF" />
        <Text style={styles.textoBotao}>Editar Medicamento</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF1F2',
  },
  conteudo: {
    padding: 16,
    paddingBottom: 40,
  },
  card: {
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
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  badgeTexto: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  nomeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 18,
  },
  nome: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1C1917',
  },
  labelSecao: {
    fontSize: 12,
    fontWeight: '700',
    color: '#9F1239',
    marginBottom: 6,
    marginTop: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  descricao: {
    fontSize: 16,
    color: '#44403C',
    lineHeight: 24,
    marginBottom: 10,
  },
  datasRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
    marginBottom: 8,
  },
  dataBox: {
    flex: 1,
    backgroundColor: '#FFF7F8',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#FECDD3',
    borderBottomWidth: 3,
    borderBottomColor: '#FDA4AF',
  },
  dataHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 4,
  },
  dataLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#9F1239',
  },
  dataValor: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1C1917',
  },
  imagem: {
    width: '100%',
    height: 240,
    borderRadius: 14,
    marginTop: 6,
    resizeMode: 'cover',
  },
  botaoEditar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F59E0B',
    borderRadius: 16,
    padding: 16,
    marginTop: 20,
    borderBottomWidth: 5,
    borderBottomColor: '#D97706',
    elevation: 5,
    shadowColor: '#D97706',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  textoBotao: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
  },
});
