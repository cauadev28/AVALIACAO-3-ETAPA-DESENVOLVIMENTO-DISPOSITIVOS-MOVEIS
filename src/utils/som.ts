import * as Haptics from 'expo-haptics';

export async function tocarSomTomei(): Promise<void> {
  try {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  } catch (erro) {
    console.error('Erro ao disparar haptic:', erro);
  }
}
