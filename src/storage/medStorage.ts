import AsyncStorage from '@react-native-async-storage/async-storage';
import { Medicamento } from '../types/Medicamento';

const CHAVE_STORAGE = '@medicamentos';

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
