const { onRequest } = require('firebase-functions/v2/https');
const cors = require('cors')({ origin: true });
const mlService = require('../services/ml.service');
const { validatePredictionRequest } = require('../utils/validation');
const { handleApiError } = require('../utils/errors');

exports.runPrediction = onRequest((req, res) => {
  return cors(req, res, async () => {
    try {
      if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed. Use POST.' });
      }

      const validation = validatePredictionRequest(req.body);
      if (!validation.valid) {
        return res.status(400).json({ error: validation.message });
      }

      const predictionResult = await mlService.predictDisease(validation.features);

      return res.status(200).json({
        success: true,
        ...predictionResult,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      return handleApiError(res, error, 'ML Disease Prediction failed.');
    }
  });
});
