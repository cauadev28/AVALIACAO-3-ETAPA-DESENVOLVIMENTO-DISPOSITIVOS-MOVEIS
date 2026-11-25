import AsyncStorage from '@react-native-async-storage/async-storage';
import { ConfiguracaoApp, Medicamento } from '../types/Medicamento';

const CHAVE_STORAGE = '@medicamentos';
const CHAVE_CONFIG = '@cuidamed_config';

export const CONFIG_PADRAO: ConfiguracaoApp = {
  nomePaciente: '',
  notificacoesAtivas: true,
  somAtivo: true,
  antecedenciaMinutos: 0,
};

export async function salvarMedicamentos(lista: Medicamento[]): Promise<void> {
  try {
    const json = JSON.stringify(lista);
    await AsyncStorage.setItem(CHAVE_STORAGE, json);
  } catch (erro) {
    console.error('Erro ao salvar medicamentos:', erro);
  }
}

export async function carregarMedicamentos(): Promise<Medicamento[]> {
  try {
    const json = await AsyncStorage.getItem(CHAVE_STORAGE);
    if (json) {
      return JSON.parse(json) as Medicamento[];
    }
    return [];
  } catch (erro) {
    console.error('Erro ao carregar medicamentos:', erro);
    return [];
  }
}

export async function salvarConfiguracao(config: ConfiguracaoApp): Promise<void> {
  try {
    await AsyncStorage.setItem(CHAVE_CONFIG, JSON.stringify(config));
  } catch (erro) {
    console.error('Erro ao salvar configuracao:', erro);
  }
}

export async function carregarConfiguracao(): Promise<ConfiguracaoApp> {
  try {
    const json = await AsyncStorage.getItem(CHAVE_CONFIG);
    if (json) {
      return { ...CONFIG_PADRAO, ...JSON.parse(json) } as ConfiguracaoApp;
    }
    return CONFIG_PADRAO;
  } catch (erro) {
    console.error('Erro ao carregar configuracao:', erro);
    return CONFIG_PADRAO;
  }
}
