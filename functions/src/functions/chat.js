const { onRequest } = require('firebase-functions/v2/https');
const { defineSecret } = require('firebase-functions/params');
const cors = require('cors')({ origin: true });
const llmService = require('../services/llm.service');
const sarvamService = require('../services/sarvam.service');
const mlService = require('../services/ml.service');
const { validateChatRequest } = require('../utils/validation');
const { handleApiError } = require('../utils/errors');

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

      // 1. Translate incoming Indic text to English if needed for internal AI processing
      let processText = message;
      if (language !== 'en-IN' && language !== 'en') {
        const transRes = await sarvamService.translateText(message, language, 'en-IN');
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
        processText,
        conversationHistory,
        language,
        mlRiskAssessment
      );

      const englishReply = typeof llmResult === 'string' ? llmResult : llmResult.reply;
      const sources = typeof llmResult === 'object' ? llmResult.sources : [];

      // 4. Translate AI reply back to user's original language if requested
      let finalReply = englishReply;
      if (language !== 'en-IN' && language !== 'en') {
        const backTransRes = await sarvamService.translateText(englishReply, 'en-IN', language);
        if (backTransRes && backTransRes.translatedText) {
          finalReply = backTransRes.translatedText;
        }
      }

      return res.status(200).json({
        success: true,
        reply: finalReply,
        englishReply: englishReply,
        sources: sources,
        language: language,
        mlRiskAssessment: mlRiskAssessment,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      return handleApiError(res, error, 'Failed to process chat response.');
    }
  });
});
