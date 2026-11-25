import { Alert, Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { ConfiguracaoApp, Medicamento } from '../types/Medicamento';

export function configurarNotificacoes() {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('lembretes', {
      name: 'Lembretes de medicamentos',
      importance: Notifications.AndroidImportance.HIGH,
      sound: 'default',
      vibrationPattern: [0, 250, 250, 250],
    });

    Notifications.setNotificationChannelAsync('lembretes_silencioso', {
      name: 'Lembretes silenciosos',
      importance: Notifications.AndroidImportance.DEFAULT,
      sound: null,
    });
  }
}

function extrairHorarios(texto: string): { hour: number; minute: number }[] {
  const regex = /\b([01]?\d|2[0-3]):([0-5]\d)\b/g;
  const encontrados: { hour: number; minute: number }[] = [];
  let match: RegExpExecArray | null;

  while ((match = regex.exec(texto)) !== null) {
    encontrados.push({
      hour: Number(match[1]),
      minute: Number(match[2]),
    });
  }

  return encontrados;
}

function aplicarAntecedencia(hour: number, minute: number, antecedencia: number) {
  let totalMinutos = hour * 60 + minute - antecedencia;
  if (totalMinutos < 0) {
    totalMinutos += 24 * 60;
  }
  return {
    hour: Math.floor(totalMinutos / 60) % 24,
    minute: totalMinutos % 60,
  };
}

async function garantirPermissao(): Promise<boolean> {
  const atual = await Notifications.getPermissionsAsync();
  let status = atual.status;

  if (status !== 'granted') {
    const pedido = await Notifications.requestPermissionsAsync();
    status = pedido.status;
  }

  return status === 'granted';
}

export async function agendarLembretes(
  nome: string,
  dosagem: string,
  horarioTexto: string,
  config?: ConfiguracaoApp
): Promise<string[]> {
  if (config && !config.notificacoesAtivas) return [];

  const horarios = extrairHorarios(horarioTexto);
  if (horarios.length === 0) return [];

  try {
    const permitido = await garantirPermissao();
    if (!permitido) {
      Alert.alert(
        'Notificações desativadas',
        'O medicamento foi salvo, mas sem permissão de notificação o alerta não vai tocar no horário.'
      );
      return [];
    }

    const somAtivo = config ? config.somAtivo : true;
    const antecedencia = config ? config.antecedenciaMinutos : 0;
    const canal = somAtivo ? 'lembretes' : 'lembretes_silencioso';

    const ids: string[] = [];
    for (const h of horarios) {
      const ajustado = aplicarAntecedencia(h.hour, h.minute, antecedencia);
      const aviso = antecedencia > 0 ? ` (em ${antecedencia} min)` : '';

      const id = await Notifications.scheduleNotificationAsync({
        content: {
          title: `Hora do medicamento${aviso}`,
          body: `${nome} - ${dosagem}`,
          sound: somAtivo,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DAILY,
          hour: ajustado.hour,
          minute: ajustado.minute,
          channelId: Platform.OS === 'android' ? canal : undefined,
        },
      });
      ids.push(id);
    }

    return ids;
  } catch (erro) {
    console.error('Erro ao agendar notificação:', erro);
    return [];
  }
}

export async function cancelarLembretes(ids?: string[]): Promise<void> {
  if (!ids || ids.length === 0) return;

  for (const id of ids) {
    try {
      await Notifications.cancelScheduledNotificationAsync(id);
    } catch (erro) {
      console.error('Erro ao cancelar notificação:', erro);
    }
  }
}

export async function reagendarTodosLembretes(
  lista: Medicamento[],
  config: ConfiguracaoApp
): Promise<Medicamento[]> {
  const atualizados: Medicamento[] = [];

  for (const med of lista) {
    await cancelarLembretes(med.notificacaoIds);
    const novosIds = config.notificacoesAtivas
      ? await agendarLembretes(med.nome, med.dosagem, med.horario, config)
      : [];
    atualizados.push({ ...med, notificacaoIds: novosIds });
  }

  return atualizados;
}

export async function dispararNotificacaoTeste(somAtivo: boolean): Promise<boolean> {
  try {
    const permitido = await garantirPermissao();
    if (!permitido) {
      Alert.alert(
        'Permissão necessária',
        'Libere as notificações nas configurações do aparelho para testar o alerta.'
      );
      return false;
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Teste de alerta - CuidaMed',
        body: somAtivo
          ? 'Notificação e alerta sonoro funcionando!'
          : 'Notificação silenciosa funcionando!',
        sound: somAtivo,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 2,
        channelId: Platform.OS === 'android'
          ? (somAtivo ? 'lembretes' : 'lembretes_silencioso')
          : undefined,
      },
    });
    return true;
  } catch (erro) {
    console.error('Erro ao testar notificação:', erro);
    return false;
  }
}
