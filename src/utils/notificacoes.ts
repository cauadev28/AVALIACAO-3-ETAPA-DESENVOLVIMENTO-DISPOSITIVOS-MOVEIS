import { Alert, Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { ConfiguracaoApp, Medicamento } from '../types/Medicamento';

export function configurarNotificacoes() {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('lembretes', {
      name: 'Lembretes de medicamentos',
      importance: Notifications.AndroidImportance.MAX,
      sound: 'default',
      vibrationPattern: [0, 500, 300, 500, 300, 500],
      enableVibrate: true,
      lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
      bypassDnd: true,
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

function somarMinutos(hour: number, minute: number, extra: number) {
  let total = hour * 60 + minute + extra;
  return {
    hour: Math.floor(total / 60) % 24,
    minute: total % 60,
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

      const id1 = await Notifications.scheduleNotificationAsync({
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
      ids.push(id1);

      const seg = somarMinutos(ajustado.hour, ajustado.minute, 5);
      const id2 = await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Lembrete - medicamento pendente',
          body: `Você ainda não tomou ${nome}! Não esqueça.`,
          sound: somAtivo,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DAILY,
          hour: seg.hour,
          minute: seg.minute,
          channelId: Platform.OS === 'android' ? canal : undefined,
        },
      });
      ids.push(id2);

      const ter = somarMinutos(ajustado.hour, ajustado.minute, 10);
      const id3 = await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Último aviso - tome seu medicamento!',
          body: `${nome} está esperando há 10 minutos. Tome agora!`,
          sound: somAtivo,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DAILY,
          hour: ter.hour,
          minute: ter.minute,
          channelId: Platform.OS === 'android' ? canal : undefined,
        },
      });
      ids.push(id3);
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

export function verificarPerdidos(medicamentos: Medicamento[]): Medicamento[] {
  const agora = new Date();
  const horaAtual = agora.getHours() * 60 + agora.getMinutes();
  const regex = /\b([01]?\d|2[0-3]):([0-5]\d)\b/g;

  return medicamentos.filter((med) => {
    if (med.tomado) return false;

    let match: RegExpExecArray | null;
    regex.lastIndex = 0;
    while ((match = regex.exec(med.horario)) !== null) {
      const horaMed = Number(match[1]) * 60 + Number(match[2]);
      if (horaAtual > horaMed) return true;
    }
    return false;
  });
}
