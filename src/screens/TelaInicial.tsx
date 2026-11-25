import React, { useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  StatusBar,
  TextInput,
  Modal,
  Animated,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import CardMedicamento from '../components/CardMedicamento';
import ListaVazia from '../components/ListaVazia';
import Icone from '../components/Icone';
import { ConfiguracaoApp, Medicamento } from '../types/Medicamento';
import {
  CONFIG_PADRAO,
  carregarConfiguracao,
  carregarMedicamentos,
  salvarMedicamentos,
} from '../storage/medStorage';
import { cancelarLembretes, verificarPerdidos } from '../utils/notificacoes';
import { tocarSomTomei } from '../utils/som';

type RootStackParamList = {
  HomeTabs: undefined;
  Cadastro: { medicamento?: Medicamento };
  Detalhes: { medicamento: Medicamento };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const FRASES_BRAVA = [
  'Ei! Você esqueceu de tomar',
  'Tá me ignorando? Faltou tomar',
  'Sem desculpas! Perdeu o horário de',
  'Esqueceu de novo?! Era pra ter tomado',
  'O remédio ficou esperando por você:',
];

export default function TelaInicial() {
  const [medicamentos, setMedicamentos] = useState<Medicamento[]>([]);
  const [config, setConfig] = useState<ConfiguracaoApp>(CONFIG_PADRAO);
  const [busca, setBusca] = useState('');
  const [filtro, setFiltro] = useState<'todos' | 'pendentes' | 'tomados'>('todos');
  const [perdidoAtual, setPerdidoAtual] = useState<Medicamento | null>(null);
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation<NavigationProp>();

  useFocusEffect(
    useCallback(() => {
      buscarMedicamentos();
    }, [])
  );

  async function buscarMedicamentos() {
    const [dados, cfg] = await Promise.all([
      carregarMedicamentos(),
      carregarConfiguracao(),
    ]);
    setMedicamentos(dados);
    setConfig(cfg);
    checarPerdidos(dados);
  }

  function checarPerdidos(lista: Medicamento[]) {
    const perdidos = verificarPerdidos(lista);
    if (perdidos.length > 0) {
      setPerdidoAtual(perdidos[0]);
      iniciarShake();
    }
  }

  function iniciarShake() {
    shakeAnim.setValue(0);
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 6, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -6, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start();
  }

  async function confirmarTomeiPerdido() {
    if (!perdidoAtual) return;
    tocarSomTomei();
    const atualizados = medicamentos.map((m) =>
      m.id === perdidoAtual.id ? { ...m, tomado: true } : m
    );
    setMedicamentos(atualizados);
    await salvarMedicamentos(atualizados);
    const proximos = verificarPerdidos(atualizados);
    setPerdidoAtual(proximos.length > 0 ? proximos[0] : null);
    if (proximos.length > 0) iniciarShake();
  }

  function ignorarPerdido() {
    if (!perdidoAtual) return;
    const proximos = medicamentos.filter(
      (m) => !m.tomado && m.id !== perdidoAtual.id && verificarPerdidos([m]).length > 0
    );
    setPerdidoAtual(proximos.length > 0 ? proximos[0] : null);
    if (proximos.length > 0) iniciarShake();
  }

  async function toggleTomado(id: string) {
    const alvo = medicamentos.find((m) => m.id === id);
    if (alvo && !alvo.tomado) {
      tocarSomTomei();
    }
    const atualizados = medicamentos.map((m) => {
      if (m.id === id) {
        return { ...m, tomado: !m.tomado };
      }
      return m;
    });
    setMedicamentos(atualizados);
    await salvarMedicamentos(atualizados);
  }

  function confirmarExclusao(id: string) {
    Alert.alert(
      'Excluir medicamento',
      'Tem certeza que deseja excluir esse medicamento da lista?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => excluirMedicamento(id),
        },
      ]
    );
  }

  async function excluirMedicamento(id: string) {
    const alvo = medicamentos.find((m) => m.id === id);
    await cancelarLembretes(alvo?.notificacaoIds);
    const filtrados = medicamentos.filter((m) => m.id !== id);
    setMedicamentos(filtrados);
    await salvarMedicamentos(filtrados);
  }

  function abrirDetalhes(medicamento: Medicamento) {
    navigation.navigate('Detalhes', { medicamento });
  }

  const medicamentosFiltrados = medicamentos.filter((m) => {
    const bateBusca =
      m.nome.toLowerCase().includes(busca.toLowerCase()) ||
      m.dosagem.toLowerCase().includes(busca.toLowerCase());

    if (!bateBusca) return false;
    if (filtro === 'pendentes') return !m.tomado;
    if (filtro === 'tomados') return m.tomado;
    return true;
  });

  const total = medicamentos.length;
  const tomados = medicamentos.filter((m) => m.tomado).length;
  const percentual = total > 0 ? Math.round((tomados / total) * 100) : 0;
  const proximoPendente = medicamentos.find((m) => !m.tomado);

  const fraseBrava = perdidoAtual
    ? FRASES_BRAVA[perdidoAtual.nome.length % FRASES_BRAVA.length]
    : '';

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <View style={styles.headerTopo}>
          <View style={styles.headerEsquerda}>
            <Icone nome="coracao" tamanho={20} cor="#FB7185" />
            <Text style={styles.appNome}>CUIDAMED</Text>
          </View>
          <View style={styles.porcentagemBox}>
            <Text style={styles.porcentagemTexto}>{percentual}%</Text>
          </View>
        </View>

        <Text style={styles.headerTitulo}>
          {config.nomePaciente ? `Olá, ${config.nomePaciente}` : 'Meus Medicamentos'}
        </Text>
        <Text style={styles.headerSubtitulo}>
          {tomados} de {total} doses tomadas hoje
        </Text>

        <View style={styles.barraFundo}>
          <View style={[styles.barraPreenchida, { width: `${percentual}%` }]} />
        </View>
      </View>

      {proximoPendente && (
        <View style={styles.proximaBox}>
          <View style={styles.proximaEsq}>
            <View style={styles.proximaTag}>
              <Icone nome="sino" tamanho={13} cor="#E11D48" />
              <Text style={styles.proximaTagTexto}>PRÓXIMA DOSE</Text>
            </View>
            <Text style={styles.proximaNome} numberOfLines={1}>
              {proximoPendente.nome} • {proximoPendente.horario}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.proximaBotao}
            onPress={() => toggleTomado(proximoPendente.id)}
            activeOpacity={0.85}
          >
            <Icone nome="check" tamanho={16} cor="#FFFFFF" />
            <Text style={styles.proximaBotaoTexto}>Tomei</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.controles}>
        <View style={styles.buscaBox}>
          <Icone nome="busca" tamanho={18} cor="#9F1239" />
          <TextInput
            style={styles.buscaInput}
            placeholder="Buscar medicamento..."
            placeholderTextColor="#D4A0A0"
            value={busca}
            onChangeText={setBusca}
          />
        </View>

        <View style={styles.filtros}>
          {(['todos', 'pendentes', 'tomados'] as const).map((item) => (
            <TouchableOpacity
              key={item}
              style={[
                styles.filtroBotao,
                filtro === item && styles.filtroBotaoAtivo,
              ]}
              onPress={() => setFiltro(item)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.filtroTexto,
                  filtro === item && styles.filtroTextoAtivo,
                ]}
              >
                {item === 'todos' ? 'Todos' : item === 'pendentes' ? 'Pendentes' : 'Tomados'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <FlatList
        data={medicamentosFiltrados}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CardMedicamento
            medicamento={item}
            onPress={abrirDetalhes}
            onToggle={toggleTomado}
            onExcluir={confirmarExclusao}
          />
        )}
        contentContainerStyle={styles.lista}
        ListEmptyComponent={
          <ListaVazia
            mensagem={
              busca || filtro !== 'todos'
                ? 'Nenhum medicamento encontrado com esse filtro.'
                : 'Nenhum medicamento cadastrado. Toque no + para adicionar!'
            }
          />
        }
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('Cadastro', {})}
        activeOpacity={0.85}
      >
        <Icone nome="mais" tamanho={28} cor="#FFFFFF" />
      </TouchableOpacity>

      <Modal
        visible={perdidoAtual !== null}
        transparent
        animationType="slide"
        onRequestClose={ignorarPerdido}
      >
        <View style={styles.modalOverlay}>
          <Animated.View
            style={[styles.modalPerdido, { transform: [{ translateX: shakeAnim }] }]}
          >
            <View style={styles.modalIconeArea}>
              <View style={styles.modalIconeCirculo}>
                <Icone nome="alerta" tamanho={36} cor="#FFFFFF" />
              </View>
            </View>

            <Text style={styles.modalBravo}>ESQUECEU DE NOVO?!</Text>
            <Text style={styles.modalFrase}>{fraseBrava}</Text>
            <Text style={styles.modalNome}>{perdidoAtual?.nome}</Text>
            <Text style={styles.modalDosagem}>{perdidoAtual?.dosagem}</Text>
            <Text style={styles.modalHorario}>
              Horário: {perdidoAtual?.horario}
            </Text>

            <Text style={styles.modalPergunta}>
              Vai tomar agora ou vai continuar ignorando?
            </Text>

            <View style={styles.modalBotoes}>
              <TouchableOpacity
                style={styles.botaoNaoVou}
                onPress={ignorarPerdido}
                activeOpacity={0.85}
              >
                <Text style={styles.botaoNaoVouTexto}>Não vou tomar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.botaoVouTomar}
                onPress={confirmarTomeiPerdido}
                activeOpacity={0.85}
              >
                <Icone nome="check" tamanho={18} cor="#FFFFFF" />
                <Text style={styles.botaoVouTomarTexto}>Tomei agora!</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF1F2',
  },
  header: {
    backgroundColor: '#881337',
    paddingTop: 52,
    paddingBottom: 22,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    elevation: 8,
    shadowColor: '#881337',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  headerTopo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerEsquerda: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  appNome: {
    color: '#FDA4AF',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 2,
  },
  headerTitulo: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '800',
    marginTop: 6,
  },
  porcentagemBox: {
    backgroundColor: '#9F1239',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#BE123C',
    borderBottomWidth: 3,
    borderBottomColor: '#4C0519',
  },
  porcentagemTexto: {
    color: '#FFF1F2',
    fontSize: 16,
    fontWeight: '800',
  },
  headerSubtitulo: {
    color: '#FDA4AF',
    fontSize: 13,
    marginTop: 4,
    marginBottom: 10,
  },
  barraFundo: {
    height: 8,
    backgroundColor: '#9F1239',
    borderRadius: 6,
    overflow: 'hidden',
  },
  barraPreenchida: {
    height: '100%',
    backgroundColor: '#FB7185',
    borderRadius: 6,
  },
  proximaBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FECDD3',
    borderBottomWidth: 4,
    borderBottomColor: '#FDA4AF',
    gap: 10,
  },
  proximaEsq: {
    flex: 1,
  },
  proximaTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 2,
  },
  proximaTagTexto: {
    fontSize: 10,
    fontWeight: '800',
    color: '#E11D48',
    letterSpacing: 1,
  },
  proximaNome: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1C1917',
  },
  proximaBotao: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#E11D48',
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 12,
    borderBottomWidth: 3,
    borderBottomColor: '#881337',
  },
  proximaBotaoTexto: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  controles: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 6,
  },
  buscaBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 46,
    borderWidth: 1,
    borderColor: '#FECDD3',
    borderBottomWidth: 3,
    borderBottomColor: '#FDA4AF',
    gap: 10,
    marginBottom: 12,
  },
  buscaInput: {
    flex: 1,
    fontSize: 15,
    color: '#1C1917',
  },
  filtros: {
    flexDirection: 'row',
    gap: 8,
  },
  filtroBotao: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FECDD3',
    borderBottomWidth: 3,
    borderBottomColor: '#FDA4AF',
  },
  filtroBotaoAtivo: {
    backgroundColor: '#E11D48',
    borderColor: '#BE123C',
    borderBottomColor: '#881337',
  },
  filtroTexto: {
    fontSize: 13,
    fontWeight: '700',
    color: '#9F1239',
  },
  filtroTextoAtivo: {
    color: '#FFFFFF',
  },
  lista: {
    padding: 16,
    paddingBottom: 100,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    width: 62,
    height: 62,
    borderRadius: 20,
    backgroundColor: '#E11D48',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 5,
    borderBottomColor: '#881337',
    elevation: 8,
    shadowColor: '#E11D48',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(76, 5, 25, 0.75)',
    justifyContent: 'flex-end',
    padding: 16,
    paddingBottom: 32,
  },
  modalPerdido: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 28,
    borderBottomWidth: 6,
    borderBottomColor: '#881337',
    elevation: 20,
    shadowColor: '#881337',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
  },
  modalIconeArea: {
    alignItems: 'center',
    marginBottom: 16,
  },
  modalIconeCirculo: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#E11D48',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 5,
    borderBottomColor: '#881337',
  },
  modalBravo: {
    fontSize: 22,
    fontWeight: '900',
    color: '#881337',
    textAlign: 'center',
    letterSpacing: 1,
    marginBottom: 6,
  },
  modalFrase: {
    fontSize: 15,
    color: '#78716C',
    textAlign: 'center',
    marginBottom: 4,
  },
  modalNome: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1C1917',
    textAlign: 'center',
    marginBottom: 2,
  },
  modalDosagem: {
    fontSize: 14,
    color: '#9F1239',
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 4,
  },
  modalHorario: {
    fontSize: 13,
    color: '#78716C',
    textAlign: 'center',
    marginBottom: 16,
  },
  modalPergunta: {
    fontSize: 15,
    fontWeight: '700',
    color: '#44403C',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalBotoes: {
    flexDirection: 'row',
    gap: 10,
  },
  botaoNaoVou: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: '#FFF1F2',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FECDD3',
    borderBottomWidth: 3,
    borderBottomColor: '#FDA4AF',
  },
  botaoNaoVouTexto: {
    fontSize: 14,
    fontWeight: '700',
    color: '#78716C',
  },
  botaoVouTomar: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: '#E11D48',
    borderBottomWidth: 4,
    borderBottomColor: '#881337',
  },
  botaoVouTomarTexto: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
