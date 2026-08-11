const { onRequest } = require('firebase-functions/v2/https');
const cors = require('cors')({ origin: true });
const sarvamService = require('../services/sarvam.service');
const { handleApiError } = require('../utils/errors');

exports.translateText = onRequest((req, res) => {
  return cors(req, res, async () => {
    try {
      if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed. Use POST.' });
      }

      const { text, sourceLanguageCode = 'auto', targetLanguageCode = 'en-IN' } = req.body;
      if (!text) {
        return res.status(400).json({ error: 'Field "text" is required.' });
      }

      const result = await sarvamService.translateText(text, sourceLanguageCode, targetLanguageCode);
      return res.status(200).json({
        success: true,
        ...result
      });
    } catch (error) {
      return handleApiError(res, error, 'Translation failed.');
    }
  });
});

exports.detectLanguage = onRequest((req, res) => {
  return cors(req, res, async () => {
    try {
      if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed. Use POST.' });
      }

      const { text } = req.body;
      if (!text) {
        return res.status(400).json({ error: 'Field "text" is required.' });
      }

      const result = await sarvamService.detectLanguage(text);
      return res.status(200).json({
        success: true,
        ...result
      });
    } catch (error) {
      return handleApiError(res, error, 'Language detection failed.');
    }
  });
});
