import { Audio } from 'expo-av';

let somCarregado: Audio.Sound | null = null;

export async function tocarSomTomei(): Promise<void> {
  try {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playsInSilentModeIOS: false,
      shouldDuckAndroid: false,
      playThroughEarpieceAndroid: false,
    });

    if (somCarregado) {
      await somCarregado.unloadAsync();
      somCarregado = null;
    }

    const { sound } = await Audio.Sound.createAsync(
      require('../../assets/sounds/tomei.wav'),
      { shouldPlay: true, volume: 1.0 }
    );

    somCarregado = sound;
    sound.setOnPlaybackStatusUpdate((status) => {
      if ('didJustFinish' in status && status.didJustFinish) {
        sound.unloadAsync();
        somCarregado = null;
      }
    });
  } catch (erro) {
    console.error('Erro ao tocar som:', erro);
  }
}
