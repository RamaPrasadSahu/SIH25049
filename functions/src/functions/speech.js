const { onRequest } = require('firebase-functions/v2/https');
const cors = require('cors')({ origin: true });
const sarvamService = require('../services/sarvam.service');
const { validateSpeechRequest } = require('../utils/validation');
const { handleApiError } = require('../utils/errors');

exports.transcribeVoice = onRequest((req, res) => {
  return cors(req, res, async () => {
    try {
      if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed. Use POST.' });
      }

      const languageCode = req.body.languageCode || 'hi-IN';
      let audioBuffer;

      if (req.body.audioBase64) {
        audioBuffer = Buffer.from(req.body.audioBase64, 'base64');
      } else {
        // Mock fallback if audio bytes are empty
        audioBuffer = Buffer.from('mock audio bytes');
      }

      const result = await sarvamService.transcribeAudio(audioBuffer, languageCode);
      return res.status(200).json({
        success: true,
        ...result
      });
    } catch (error) {
      return handleApiError(res, error, 'Speech-to-Text transcription failed.');
    }
  });
});

exports.generateSpeech = onRequest((req, res) => {
  return cors(req, res, async () => {
    try {
      if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed. Use POST.' });
      }

      const validation = validateSpeechRequest(req.body);
      if (!validation.valid) {
        return res.status(400).json({ error: validation.message });
      }

      const { text, targetLanguageCode = 'hi-IN', speaker = 'meera' } = req.body;
      const result = await sarvamService.textToSpeech(text, targetLanguageCode, speaker);

      return res.status(200).json({
        success: true,
        ...result
      });
    } catch (error) {
      return handleApiError(res, error, 'Text-to-Speech generation failed.');
    }
  });
});
