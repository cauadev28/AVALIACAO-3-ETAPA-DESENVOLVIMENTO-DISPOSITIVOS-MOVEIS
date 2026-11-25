import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Icone from '../components/Icone';
import { ConfiguracaoApp } from '../types/Medicamento';
import {
  CONFIG_PADRAO,
  carregarConfiguracao,
  salvarConfiguracao,
  carregarMedicamentos,
  salvarMedicamentos,
} from '../storage/medStorage';
import {
  cancelarLembretes,
  reagendarTodosLembretes,
} from '../utils/notificacoes';

export default function TelaConfiguracoes() {
  const [config, setConfig] = useState<ConfiguracaoApp>(CONFIG_PADRAO);
  const [salvando, setSalvando] = useState(false);

  useFocusEffect(
    useCallback(() => {
      carregarConfiguracao().then(setConfig);
    }, [])
  );

  async function atualizarConfig(nova: ConfiguracaoApp, reagendar = false) {
    setConfig(nova);
    await salvarConfiguracao(nova);

    if (reagendar) {
      setSalvando(true);
      const lista = await carregarMedicamentos();
      const atualizados = await reagendarTodosLembretes(lista, nova);
      await salvarMedicamentos(atualizados);
      setSalvando(false);
    }
  }

  function reiniciarDosesDia() {
    Alert.alert(
      'Novo dia',
      'Deseja desmarcar todos os medicamentos tomados hoje para iniciar um novo ciclo?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Reiniciar',
          onPress: async () => {
            const lista = await carregarMedicamentos();
            const resetados = lista.map((m) => ({ ...m, tomado: false }));
            await salvarMedicamentos(resetados);
            Alert.alert('Pronto', 'Todas as doses de hoje foram reiniciadas.');
          },
        },
      ]
    );
  }

  function limparTudo() {
    Alert.alert(
      'Apagar todos os dados',
      'Isso vai remover todos os medicamentos cadastrados e cancelar todos os lembretes. Deseja continuar?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Apagar tudo',
          style: 'destructive',
          onPress: async () => {
            const lista = await carregarMedicamentos();
            for (const med of lista) {
              await cancelarLembretes(med.notificacaoIds);
            }
            await salvarMedicamentos([]);
            Alert.alert('Limpo', 'Todos os medicamentos foram removidos.');
          },
        },
      ]
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollConteudo}>
      <View style={styles.header}>
        <View style={styles.headerLogo}>
          <Icone nome="config" tamanho={20} cor="#FB7185" />
          <Text style={styles.appNome}>CUIDAMED</Text>
        </View>
        <Text style={styles.headerTitulo}>Configurações</Text>
        <Text style={styles.headerSubtitulo}>Alertas, som e preferências do dia</Text>
      </View>

      <View style={styles.secao}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Icone nome="usuario" tamanho={20} cor="#E11D48" />
            <Text style={styles.cardTitulo}>Perfil do paciente</Text>
          </View>

          <Text style={styles.label}>Nome exibido na tela inicial (opcional)</Text>
          <View style={styles.perfilRow}>
            <TextInput
              style={styles.input}
              placeholder="Ex: Maria, João ou Uso Pessoal"
              placeholderTextColor="#D4A0A0"
              value={config.nomePaciente}
              onChangeText={(texto) => setConfig({ ...config, nomePaciente: texto })}
              maxLength={35}
            />
            <TouchableOpacity
              style={styles.botaoSalvarNome}
              onPress={() => {
                atualizarConfig({ ...config, nomePaciente: config.nomePaciente.trim() });
                Alert.alert('Salvo', 'Nome atualizado!');
              }}
              activeOpacity={0.8}
            >
              <Icone nome="check" tamanho={18} cor="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Icone nome="sino" tamanho={20} cor="#E11D48" />
            <Text style={styles.cardTitulo}>Lembretes e alerta sonoro</Text>
          </View>

          <View style={styles.opcaoLinha}>
            <View style={styles.opcaoTextoBox}>
              <Text style={styles.opcaoTitulo}>Ativar notificações</Text>
              <Text style={styles.opcaoSub}>Receber avisos nos horários cadastrados</Text>
            </View>
            <Switch
              value={config.notificacoesAtivas}
              onValueChange={(val) =>
                atualizarConfig({ ...config, notificacoesAtivas: val }, true)
              }
              trackColor={{ false: '#E7E5E4', true: '#FDA4AF' }}
              thumbColor={config.notificacoesAtivas ? '#E11D48' : '#A8A29E'}
            />
          </View>

          <View style={styles.divisor} />

          <View style={styles.opcaoLinha}>
            <View style={styles.opcaoTextoBox}>
              <Text style={styles.opcaoTitulo}>Alerta sonoro</Text>
              <Text style={styles.opcaoSub}>Tocar som junto com a notificação</Text>
            </View>
            <Switch
              value={config.somAtivo}
              onValueChange={(val) =>
                atualizarConfig({ ...config, somAtivo: val }, true)
              }
              disabled={!config.notificacoesAtivas}
              trackColor={{ false: '#E7E5E4', true: '#FDA4AF' }}
              thumbColor={config.somAtivo ? '#E11D48' : '#A8A29E'}
            />
          </View>

          <View style={styles.divisor} />

          <Text style={styles.label}>Avisar com antecedência</Text>
          <View style={styles.antecedenciaRow}>
            {([0, 5, 15] as const).map((min) => {
              const ativo = config.antecedenciaMinutos === min;
              return (
                <TouchableOpacity
                  key={min}
                  style={[styles.chip, ativo && styles.chipAtivo]}
                  onPress={() =>
                    atualizarConfig({ ...config, antecedenciaMinutos: min }, true)
                  }
                  disabled={!config.notificacoesAtivas || salvando}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.chipTexto, ativo && styles.chipTextoAtivo]}>
                    {min === 0 ? 'Na hora' : `${min} min antes`}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Icone nome="atualizar" tamanho={20} cor="#E11D48" />
            <Text style={styles.cardTitulo}>Rotina e dados</Text>
          </View>

          <TouchableOpacity
            style={styles.botaoRotina}
            onPress={reiniciarDosesDia}
            activeOpacity={0.85}
          >
            <Icone nome="atualizar" tamanho={18} cor="#881337" />
            <View style={styles.rotinaTextoBox}>
              <Text style={styles.rotinaTitulo}>Reiniciar doses de hoje</Text>
              <Text style={styles.rotinaSub}>Desmarca todos os remédios tomados para um novo dia</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.botaoRotina, styles.botaoPerigo]}
            onPress={limparTudo}
            activeOpacity={0.85}
          >
            <Icone nome="lixeira" tamanho={18} cor="#E11D48" />
            <View style={styles.rotinaTextoBox}>
              <Text style={[styles.rotinaTitulo, { color: '#E11D48' }]}>
                Apagar todos os medicamentos
              </Text>
              <Text style={styles.rotinaSub}>Remove toda a lista e os lembretes salvos</Text>
            </View>
          </TouchableOpacity>
        </View>
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
    paddingBottom: 36,
  },
  header: {
    backgroundColor: '#881337',
    paddingTop: 52,
    paddingBottom: 24,
    paddingHorizontal: 20,
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
    fontSize: 26,
    fontWeight: '800',
  },
  headerSubtitulo: {
    color: '#FDA4AF',
    fontSize: 13,
    marginTop: 4,
  },
  secao: {
    padding: 16,
    gap: 14,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
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
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  cardTitulo: {
    fontSize: 16,
    fontWeight: '800',
    color: '#881337',
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#9F1239',
    marginBottom: 8,
  },
  perfilRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#FFF7F8',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#1C1917',
    borderWidth: 1,
    borderColor: '#FECDD3',
    borderBottomWidth: 3,
  },
  botaoSalvarNome: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#E11D48',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 4,
    borderBottomColor: '#881337',
  },
  opcaoLinha: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  opcaoTextoBox: {
    flex: 1,
    paddingRight: 12,
  },
  opcaoTitulo: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1C1917',
  },
  opcaoSub: {
    fontSize: 12,
    color: '#78716C',
    marginTop: 2,
  },
  divisor: {
    height: 1,
    backgroundColor: '#FFE4E6',
    marginVertical: 10,
  },
  antecedenciaRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  chip: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#FFF7F8',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FECDD3',
    borderBottomWidth: 3,
    borderBottomColor: '#FDA4AF',
  },
  chipAtivo: {
    backgroundColor: '#E11D48',
    borderColor: '#BE123C',
    borderBottomColor: '#881337',
  },
  chipTexto: {
    fontSize: 13,
    fontWeight: '700',
    color: '#9F1239',
  },
  chipTextoAtivo: {
    color: '#FFFFFF',
  },
  botaoTeste: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#E11D48',
    borderRadius: 14,
    paddingVertical: 14,
    borderBottomWidth: 4,
    borderBottomColor: '#881337',
  },
  textoBotaoTeste: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  botaoRotina: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFF7F8',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#FECDD3',
    borderBottomWidth: 3,
    borderBottomColor: '#FDA4AF',
    marginBottom: 10,
  },
  botaoPerigo: {
    marginBottom: 0,
    backgroundColor: '#FFF1F2',
  },
  rotinaTextoBox: {
    flex: 1,
  },
  rotinaTitulo: {
    fontSize: 14,
    fontWeight: '700',
    color: '#881337',
  },
  rotinaSub: {
    fontSize: 12,
    color: '#78716C',
    marginTop: 2,
  },
});
