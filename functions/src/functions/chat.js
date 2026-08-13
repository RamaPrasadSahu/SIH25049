const { onRequest } = require('firebase-functions/v2/https');
const { defineSecret } = require('firebase-functions/params');
const cors = require('cors')({ origin: true });
const llmService = require('../services/llm.service');
const sarvamService = require('../services/sarvam.service');
const mlService = require('../services/ml.service');
const { validateChatRequest } = require('../utils/validation');
const { handleApiError } = require('../utils/errors');
const { detectLanguageFromText } = require('../utils/language');

// Bind GEMINI_API_KEY secret for Firebase Functions v2
const geminiApiKey = defineSecret('GEMINI_API_KEY');

exports.generateChatResponse = onRequest({ secrets: [geminiApiKey] }, (req, res) => {
  return cors(req, res, async () => {
    try {
      if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed. Use POST.' });
      }

      const validation = validateChatRequest(req.body);
      if (!validation.valid) {
        return res.status(400).json({ error: validation.message });
      }

      const { message, conversationHistory = [], language = 'en-IN', features } = req.body;
      const activeLang = detectLanguageFromText(message, language);

      // 1. Translate incoming Indic text to English if needed for internal AI processing
      let processText = message;
      if (activeLang !== 'en-IN' && activeLang !== 'en') {
        const transRes = await sarvamService.translateText(message, activeLang, 'en-IN');
        if (transRes && transRes.translatedText) {
          processText = transRes.translatedText;
        }
      }

      // 2. Run ML prediction if symptom features are supplied
      let mlRiskAssessment = null;
      if (features && Object.keys(features).length > 0) {
        mlRiskAssessment = await mlService.predictDisease(features);
      }

      // 3. Generate grounded LLM response with parallel PDF RAG & Web Search evidence
      const llmResult = await llmService.generateResponse(
        message,
        conversationHistory,
        activeLang,
        mlRiskAssessment
      );

      const generatedReply = typeof llmResult === 'string' ? llmResult : llmResult.reply;
      const sources = typeof llmResult === 'object' ? llmResult.sources : [];

      // 4. Translate AI reply back to user's detected language if LLM outputted English
      let finalReply = generatedReply;
      if (activeLang !== 'en-IN' && activeLang !== 'en') {
        // If final reply is still in English script, translate to activeLang
        if (/^[A-Za-z0-9\s\.,!\?#\*\-\(\)]+$/.test(generatedReply.replace(/###|#|\*|-/g, '').slice(0, 100))) {
          const backTransRes = await sarvamService.translateText(generatedReply, 'en-IN', activeLang);
          if (backTransRes && backTransRes.translatedText) {
            finalReply = backTransRes.translatedText;
          }
        }
      }

      return res.status(200).json({
        success: true,
        reply: finalReply,
        englishReply: generatedReply,
        sources: sources,
        language: activeLang,
        mlRiskAssessment: mlRiskAssessment,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      return handleApiError(res, error, 'Failed to process chat response.');
    }
  });
});
