const express = require('express');
const cors = require('cors');
const llmService = require('./src/services/llm.service');
const sarvamService = require('./src/services/sarvam.service');
const mlService = require('./src/services/ml.service');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/generateChatResponse', async (req, res) => {
  try {
    const { message, conversationHistory = [], language = 'od-IN', features } = req.body;

    let mlRiskAssessment = null;
    if (features && Object.keys(features).length > 0) {
      try {
        mlRiskAssessment = await mlService.predictDisease(features);
      } catch (e) {}
    }

    const llmResult = await llmService.generateResponse(
      message,
      conversationHistory,
      language,
      mlRiskAssessment
    );

    const reply = typeof llmResult === 'string' ? llmResult : llmResult.reply;
    const sources = typeof llmResult === 'object' ? llmResult.sources : [];

    return res.json({
      success: true,
      reply: reply,
      sources: sources,
      language: language,
      mlRiskAssessment: mlRiskAssessment,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ error: error.message });
  }
});

app.post('/health-agent-7079a/us-central1/generateChatResponse', async (req, res) => {
  try {
    const { message, conversationHistory = [], language = 'od-IN', features } = req.body;

    let mlRiskAssessment = null;
    if (features && Object.keys(features).length > 0) {
      try {
        mlRiskAssessment = await mlService.predictDisease(features);
      } catch (e) {}
    }

    const llmResult = await llmService.generateResponse(
      message,
      conversationHistory,
      language,
      mlRiskAssessment
    );

    const reply = typeof llmResult === 'string' ? llmResult : llmResult.reply;
    const sources = typeof llmResult === 'object' ? llmResult.sources : [];

    return res.json({
      success: true,
      reply: reply,
      sources: sources,
      language: language,
      mlRiskAssessment: mlRiskAssessment,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ error: error.message });
  }
});

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`🚀 Swasthya Sakha Node AI Backend running live on http://127.0.0.1:${PORT}`);
});
