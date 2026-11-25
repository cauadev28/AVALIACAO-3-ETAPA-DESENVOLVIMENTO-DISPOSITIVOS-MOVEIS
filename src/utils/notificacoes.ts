import { Alert, Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

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

export async function agendarLembretes(
  nome: string,
  dosagem: string,
  horarioTexto: string
): Promise<string[]> {
  const horarios = extrairHorarios(horarioTexto);
  if (horarios.length === 0) return [];

  try {
    const atual = await Notifications.getPermissionsAsync();
    let status = atual.status;

    if (status !== 'granted') {
      const pedido = await Notifications.requestPermissionsAsync();
      status = pedido.status;
    }

    if (status !== 'granted') {
      Alert.alert(
        'Notificações desativadas',
        'O medicamento foi salvo, mas sem permissão de notificação o alerta sonoro não vai tocar no horário.'
      );
      return [];
    }

    const ids: string[] = [];
    for (const h of horarios) {
      const id = await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Hora do medicamento',
          body: `${nome} - ${dosagem}`,
          sound: true,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DAILY,
          hour: h.hour,
          minute: h.minute,
          channelId: Platform.OS === 'android' ? 'lembretes' : undefined,
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
