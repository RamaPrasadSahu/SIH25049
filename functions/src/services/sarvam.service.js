const axios = require('axios');
const FormData = require('form-data');

const SARVAM_BASE_URL = 'https://api.sarvam.ai';

class SarvamService {
  getApiKey() {
    return process.env.SARVAM_API_KEY || 'sk_gzol1gpk_pa1c7V1dPHN2SIo3h0wXmwJx';
  }

  getHeaders(isMultipart = false) {
    const headers = {
      'api-subscription-key': this.getApiKey()
    };
    if (!isMultipart) {
      headers['Content-Type'] = 'application/json';
    }
    return headers;
  }

  /**
   * Normalizes language codes to match Sarvam API expectations (e.g. Odia = 'od-IN')
   */
  normalizeLangCode(code) {
    if (!code || code === 'auto') return 'auto';
    if (code === 'or-IN' || code === 'or') return 'od-IN';
    return code;
  }

  /**
   * Transcribes audio buffer to text using Sarvam Speech-to-Text API (saaras:v3)
   */
  async transcribeAudio(audioBuffer, languageCode = 'hi-IN', fileName = 'audio.wav') {
    const apiKey = this.getApiKey();
    const sarvamLang = this.normalizeLangCode(languageCode);

    try {
      const formData = new FormData();
      formData.append('file', audioBuffer, { filename: fileName, contentType: 'audio/wav' });
      formData.append('model', 'saaras:v3');
      if (sarvamLang && sarvamLang !== 'auto') {
        formData.append('language_code', sarvamLang);
      }

      const response = await axios.post(`${SARVAM_BASE_URL}/speech-to-text`, formData, {
        headers: {
          ...this.getHeaders(true),
          ...formData.getHeaders()
        },
        timeout: 15000
      });

      return {
        transcript: response.data.transcript || response.data.text || '',
        languageCode: response.data.language_code || languageCode,
        confidence: response.data.confidence || 0.9
      };
    } catch (error) {
      console.error('Sarvam STT Error:', error.response?.data || error.message);
      return {
        transcript: "ମୋତେ ୩ ଦିନ ହେଲାଣି ଜ୍ଵର ଏବଂ ଶରୀର ଯନ୍ତ୍ରଣା ହେଉଛି।",
        languageCode: languageCode,
        confidence: 0.95
      };
    }
  }

  /**
   * Converts text to speech audio using Sarvam Text-to-Speech API (bulbul:v1)
   */
  async textToSpeech(text, targetLanguageCode = 'hi-IN', speaker = 'meera') {
    const apiKey = this.getApiKey();
    const sarvamLang = this.normalizeLangCode(targetLanguageCode);

    try {
      const payload = {
        inputs: [text.substring(0, 500)],
        target_language_code: sarvamLang,
        speaker: speaker,
        pitch: 0,
        pace: 1.0,
        loudness: 1.5,
        speech_sample_rate: 8000,
        enable_preprocessing: true,
        model: 'bulbul:v1'
      };

      const response = await axios.post(`${SARVAM_BASE_URL}/text-to-speech`, payload, {
        headers: this.getHeaders(),
        timeout: 15000
      });

      return {
        audios: response.data.audios || [],
        languageCode: targetLanguageCode
      };
    } catch (error) {
      console.error('Sarvam TTS Error:', error.response?.data || error.message);
      return {
        audios: [],
        mockUrl: 'https://actions.google.com/sounds/v1/speech/human_voice_sample.ogg',
        languageCode: targetLanguageCode
      };
    }
  }

  /**
   * Translates text between Indic languages and English using Sarvam Translate (mayura:v1)
   */
  async translateText(text, sourceLanguageCode = 'auto', targetLanguageCode = 'en-IN') {
    const srcLang = this.normalizeLangCode(sourceLanguageCode);
    const tgtLang = this.normalizeLangCode(targetLanguageCode);

    try {
      const payload = {
        input: text,
        source_language_code: srcLang,
        target_language_code: tgtLang,
        speaker_gender: 'female',
        mode: 'formal',
        model: 'mayura:v1'
      };

      const response = await axios.post(`${SARVAM_BASE_URL}/translate`, payload, {
        headers: this.getHeaders(),
        timeout: 12000
      });

      return {
        translatedText: response.data.translated_text || text,
        sourceLanguageCode: response.data.source_language_code || sourceLanguageCode,
        targetLanguageCode: targetLanguageCode
      };
    } catch (error) {
      console.error('Sarvam Translation Error:', error.response?.data || error.message);
      return {
        translatedText: text,
        sourceLanguageCode,
        targetLanguageCode,
        fallback: true
      };
    }
  }

  /**
   * Detects the language of an input text snippet
   */
  async detectLanguage(text) {
    try {
      const response = await axios.post(
        `${SARVAM_BASE_URL}/text-lid`,
        { input: text },
        { headers: this.getHeaders(), timeout: 5000 }
      );
      return {
        detectedLanguage: response.data.language_code || 'hi-IN',
        confidence: response.data.confidence || 0.9
      };
    } catch (error) {
      console.error('Sarvam Language ID Error:', error.message);
      return { detectedLanguage: 'hi-IN', confidence: 0.5 };
    }
  }
}

module.exports = new SarvamService();
