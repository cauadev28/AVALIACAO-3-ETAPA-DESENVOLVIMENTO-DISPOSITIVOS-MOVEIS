import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import Icone from '../components/Icone';
import SeletorHorario from '../components/SeletorHorario';
import { Medicamento } from '../types/Medicamento';
import {
  carregarConfiguracao,
  carregarMedicamentos,
  salvarMedicamentos,
} from '../storage/medStorage';
import { agendarLembretes, cancelarLembretes } from '../utils/notificacoes';

type RootStackParamList = {
  HomeTabs: undefined;
  Cadastro: { medicamento?: Medicamento };
  Detalhes: { medicamento: Medicamento };
};

type CadastroRouteProp = RouteProp<RootStackParamList, 'Cadastro'>;

export default function TelaCadastro() {
  const navigation = useNavigation();
  const route = useRoute<CadastroRouteProp>();
  const editando = route.params?.medicamento;

  const [nome, setNome] = useState('');
  const [dosagem, setDosagem] = useState('');
  const [horariosLista, setHorariosLista] = useState<string[]>([]);
  const [tipo, setTipo] = useState<'continuo' | 'temporario' | 'urgente'>('continuo');
  const [observacao, setObservacao] = useState('');
  const [foto, setFoto] = useState<string | null>(null);

  useEffect(() => {
    if (editando) {
      setNome(editando.nome);
      setDosagem(editando.dosagem);
      const horariosExistentes = editando.horario
        .split(/\s+e\s+/)
        .map((h) => h.trim())
        .filter((h) => /^\d{2}:\d{2}$/.test(h));
      setHorariosLista(horariosExistentes);
      setTipo(editando.tipo);
      setObservacao(editando.observacao || '');
      setFoto(editando.foto);
    }
  }, [editando]);

  async function tirarFoto() {
    const permissao = await ImagePicker.requestCameraPermissionsAsync();

    if (!permissao.granted) {
      Alert.alert(
        'Permissão necessária',
        'Precisamos da permissão da câmera para fotografar a caixa do remédio ou receita. Vá nas configurações do aparelho e libere o acesso.'
      );
      return;
    }

    const resultado = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!resultado.canceled && resultado.assets.length > 0) {
      setFoto(resultado.assets[0].uri);
    }
  }

  async function escolherDaGaleria() {
    const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissao.granted) {
      Alert.alert(
        'Permissão necessária',
        'Precisamos da permissão para acessar suas fotos. Vá nas configurações e libere o acesso.'
      );
      return;
    }

    const resultado = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!resultado.canceled && resultado.assets.length > 0) {
      setFoto(resultado.assets[0].uri);
    }
  }

  function validarCampos(): boolean {
    if (!nome.trim()) {
      Alert.alert('Campo obrigatório', 'Informe o nome do medicamento.');
      return false;
    }
    if (nome.trim().length < 3) {
      Alert.alert('Nome muito curto', 'O nome precisa ter pelo menos 3 caracteres.');
      return false;
    }
    if (!dosagem.trim()) {
      Alert.alert('Campo obrigatório', 'Informe a dosagem (ex: 500mg - 1 comprimido).');
      return false;
    }
    if (horariosLista.length === 0) {
      Alert.alert('Campo obrigatório', 'Adicione pelo menos um horário de uso.');
      return false;
    }
    return true;
  }

  async function salvar() {
    if (!validarCampos()) return;

    const horarioTexto = horariosLista.join(' e ');
    const existentes = await carregarMedicamentos();
    const config = await carregarConfiguracao();

    if (editando) {
      await cancelarLembretes(editando.notificacaoIds);
      const novosIds = await agendarLembretes(nome.trim(), dosagem.trim(), horarioTexto, config);

      const atualizados = existentes.map((m) => {
        if (m.id === editando.id) {
          return {
            ...m,
            nome: nome.trim(),
            dosagem: dosagem.trim(),
            horario: horarioTexto,
            tipo,
            observacao: observacao.trim(),
            foto,
            notificacaoIds: novosIds,
          };
        }
        return m;
      });
      await salvarMedicamentos(atualizados);
      Alert.alert('Sucesso', 'Medicamento atualizado!');
    } else {
      const novosIds = await agendarLembretes(nome.trim(), dosagem.trim(), horarioTexto, config);

      const novo: Medicamento = {
        id: Date.now().toString(),
        nome: nome.trim(),
        dosagem: dosagem.trim(),
        horario: horarioTexto,
        tipo,
        tomado: false,
        observacao: observacao.trim(),
        foto,
        criadoEm: new Date().toLocaleDateString('pt-BR'),
        notificacaoIds: novosIds,
      };
      existentes.push(novo);
      await salvarMedicamentos(existentes);
      Alert.alert('Sucesso', 'Medicamento cadastrado!');
    }

    navigation.goBack();
  }

  function corBotaoTipo(t: 'continuo' | 'temporario' | 'urgente') {
    if (t === 'urgente') return { bg: '#E11D48', border: '#BE123C' };
    if (t === 'temporario') return { bg: '#F59E0B', border: '#D97706' };
    return { bg: '#0EA5E9', border: '#0284C7' };
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView style={styles.container} contentContainerStyle={styles.conteudo}>
        <View style={styles.cardForm}>
          <View style={styles.formHeader}>
            <Icone nome="pilula" tamanho={22} cor="#E11D48" />
            <Text style={styles.formTitulo}>Dados do medicamento</Text>
          </View>

          <Text style={styles.label}>Nome do medicamento *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Paracetamol"
            placeholderTextColor="#D4A0A0"
            value={nome}
            onChangeText={setNome}
            maxLength={60}
          />

          <Text style={styles.label}>Dosagem *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: 750mg - 1 comprimido"
            placeholderTextColor="#D4A0A0"
            value={dosagem}
            onChangeText={setDosagem}
            maxLength={40}
          />

          <Text style={styles.label}>Horário de uso *</Text>
          <SeletorHorario
            horarios={horariosLista}
            onChange={setHorariosLista}
          />

          <Text style={styles.label}>Observações (opcional)</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Tomar após o almoço"
            placeholderTextColor="#D4A0A0"
            value={observacao}
            onChangeText={setObservacao}
            maxLength={80}
          />

          <Text style={styles.label}>Tipo de uso</Text>
          <View style={styles.tipoContainer}>
            {(['continuo', 'temporario', 'urgente'] as const).map((t) => {
              const ativo = tipo === t;
              const cores = corBotaoTipo(t);
              return (
                <TouchableOpacity
                  key={t}
                  style={[
                    styles.botaoTipo,
                    ativo && {
                      backgroundColor: cores.bg,
                      borderColor: cores.bg,
                      borderBottomColor: cores.border,
                    },
                  ]}
                  onPress={() => setTipo(t)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.textoTipo,
                      ativo && styles.textoTipoSelecionado,
                    ]}
                  >
                    {t === 'urgente' ? 'Urgente' : t === 'temporario' ? 'Temporário' : 'Contínuo'}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={styles.label}>Foto da caixa ou receita (opcional)</Text>
          <View style={styles.fotoContainer}>
            <TouchableOpacity style={styles.botaoFoto} onPress={tirarFoto} activeOpacity={0.8}>
              <Icone nome="camera" tamanho={20} cor="#E11D48" />
              <Text style={styles.textoFoto}>Câmera</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.botaoFoto} onPress={escolherDaGaleria} activeOpacity={0.8}>
              <Icone nome="galeria" tamanho={20} cor="#E11D48" />
              <Text style={styles.textoFoto}>Galeria</Text>
            </TouchableOpacity>
          </View>

          {foto && (
            <View style={styles.previewContainer}>
              <Image source={{ uri: foto }} style={styles.previewImagem} />
              <TouchableOpacity
                style={styles.botaoRemoverFoto}
                onPress={() => setFoto(null)}
                activeOpacity={0.8}
              >
                <Icone nome="lixeira" tamanho={16} cor="#E11D48" />
                <Text style={styles.removerFoto}>Remover foto</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <TouchableOpacity style={styles.botaoSalvar} onPress={salvar} activeOpacity={0.85}>
          <Icone nome="coracao" tamanho={20} cor="#FFFFFF" />
          <Text style={styles.textoSalvar}>
            {editando ? 'Atualizar Medicamento' : 'Cadastrar Medicamento'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
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
  cardForm: {
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
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  formHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  formTitulo: {
    fontSize: 16,
    fontWeight: '700',
    color: '#881337',
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#881337',
    marginBottom: 6,
    marginTop: 14,
  },
  input: {
    backgroundColor: '#FFF7F8',
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: '#1C1917',
    borderWidth: 1,
    borderColor: '#FECDD3',
    borderBottomWidth: 3,
  },
  tipoContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  botaoTipo: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#FFF7F8',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FECDD3',
    borderBottomWidth: 4,
    borderBottomColor: '#FDA4AF',
  },
  textoTipo: {
    fontSize: 13,
    fontWeight: '700',
    color: '#9F1239',
  },
  textoTipoSelecionado: {
    color: '#FFFFFF',
  },
  fotoContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  botaoFoto: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFF1F2',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#FECDD3',
    borderBottomWidth: 4,
    borderBottomColor: '#FDA4AF',
  },
  textoFoto: {
    fontSize: 15,
    fontWeight: '700',
    color: '#9F1239',
  },
  previewContainer: {
    alignItems: 'center',
    marginTop: 14,
  },
  previewImagem: {
    width: '100%',
    height: 200,
    borderRadius: 14,
    resizeMode: 'cover',
  },
  botaoRemoverFoto: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#FFF1F2',
  },
  removerFoto: {
    color: '#E11D48',
    fontSize: 13,
    fontWeight: '700',
  },
  botaoSalvar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#E11D48',
    borderRadius: 16,
    padding: 16,
    marginTop: 20,
    borderBottomWidth: 5,
    borderBottomColor: '#881337',
    elevation: 5,
    shadowColor: '#E11D48',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
  },
  textoSalvar: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
  },
});
