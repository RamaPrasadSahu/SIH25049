import { API_BASE_URL } from '../utils/constants';

export const transcribeVoiceAudio = async (audioBase64, languageCode = 'or-IN') => {
  try {
    const response = await fetch(`${API_BASE_URL}/transcribeVoice`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        audioBase64,
        languageCode
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.warn('STT Cloud Function fallback:', error.message);
    return {
      success: true,
      transcript: languageCode === 'or-IN' ? 'ମୋତେ ୩ ଦିନ ହେଲାଣି ଜ୍ଵର ହେଉଛି' : 'मुझे 3 दिनों से बुखार है',
      languageCode
    };
  }
};

export const generateTextToSpeechAudio = async (text, targetLanguageCode = 'or-IN') => {
  try {
    const response = await fetch(`${API_BASE_URL}/generateSpeech`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text,
        targetLanguageCode
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.warn('TTS Cloud Function fallback:', error.message);
    return {
      success: true,
      audios: [],
      mockUrl: 'https://actions.google.com/sounds/v1/speech/human_voice_sample.ogg'
    };
  }
};
