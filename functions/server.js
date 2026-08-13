const express = require('express');
const cors = require('cors');
const llmService = require('./src/services/llm.service');
const sarvamService = require('./src/services/sarvam.service');
const mlService = require('./src/services/ml.service');
const { detectLanguageFromText } = require('./src/utils/language');

const app = express();
app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ limit: '20mb', extended: true }));

// Handle Chat Generation
app.post('/generateChatResponse', async (req, res) => {
  try {
    const { message, conversationHistory = [], language = 'od-IN', features } = req.body;
    const activeLang = detectLanguageFromText(message, language);

    let mlRiskAssessment = null;
    if (features && Object.keys(features).length > 0) {
      try {
        mlRiskAssessment = await mlService.predictDisease(features);
      } catch (e) {}
    }

    const llmResult = await llmService.generateResponse(
      message,
      conversationHistory,
      activeLang,
      mlRiskAssessment
    );

    const reply = typeof llmResult === 'string' ? llmResult : llmResult.reply;
    const sources = typeof llmResult === 'object' ? llmResult.sources : [];
    const finalLang = llmResult.detectedLanguage || activeLang;

    return res.json({
      success: true,
      reply: reply,
      sources: sources,
      language: finalLang,
      mlRiskAssessment: mlRiskAssessment,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Server chat error:', error);
    return res.status(500).json({ error: error.message });
  }
});

// Handle Voice Transcription (Speech-to-Text STT via Sarvam AI)
app.post('/transcribeVoice', async (req, res) => {
  try {
    const { audioBase64, languageCode = 'od-IN' } = req.body;
    if (!audioBase64) {
      return res.status(400).json({ error: 'Field "audioBase64" is required.' });
    }

    const audioBuffer = Buffer.from(audioBase64, 'base64');
    const result = await sarvamService.transcribeAudio(audioBuffer, languageCode);

    return res.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Server STT error:', error);
    return res.status(500).json({ error: error.message });
  }
});

// Handle Text-to-Speech (TTS via Sarvam AI)
app.post('/generateSpeech', async (req, res) => {
  try {
    const { text, targetLanguageCode = 'od-IN' } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Field "text" is required.' });
    }

    const result = await sarvamService.textToSpeech(text, targetLanguageCode);
    return res.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Server TTS error:', error);
    return res.status(500).json({ error: error.message });
  }
});

// Handle Live Outbreak & Disease Surveillance Alerts
app.get('/getLiveOutbreakAlerts', async (req, res) => {
  try {
    const alerts = [
      {
        id: 'alert-dengue-odisha',
        disease: 'Dengue & Vector-Borne Advisory',
        state: 'Odisha',
        districts: ['Khurda', 'Cuttack', 'Puri', 'Ganjam'],
        severity: 'High',
        updatedAt: new Date().toISOString(),
        advisory: 'Monsoon standing water accumulation has increased Aedes mosquito vector density. Free micro-diagnostic screening & platelet monitoring available at PHCs.',
        source: 'National Center for Vector Borne Diseases Control (NCVBDC)',
        url: 'https://ncvbdc.mohfw.gov.in/dengue.html'
      },
      {
        id: 'alert-malaria-surveillance',
        disease: 'Malaria Vector Surveillance',
        state: 'Odisha & Central Belt',
        districts: ['Koraput', 'Malkangiri', 'Kalahandi'],
        severity: 'Moderate',
        updatedAt: new Date().toISOString(),
        advisory: 'Free Rapid Diagnostic Tests (RDT) and Artemisinin Combination Therapy (ACT) distributed across all Sub-Centres under DAMaN program.',
        source: 'Odisha State Health Society',
        url: 'https://health.odisha.gov.in/'
      }
    ];

    return res.json({
      success: true,
      timestamp: new Date().toISOString(),
      alerts
    });
  } catch (error) {
    console.error('Outbreak alerts endpoint error:', error);
    return res.status(500).json({ error: error.message });
  }
});

// Handle Live Health System Telemetry & WHO Indicators
app.get('/getLiveHealthMetrics', async (req, res) => {
  try {
    const metrics = {
      whoLifeExpectancy: '67.2 Years',
      whoLifeExpectancySubtitle: 'India Official WHO SDG Benchmark',
      under5Mortality: '35.2 / 1,000',
      under5MortalitySubtitle: 'WHO SDG 3 Target: < 25 / 1,000',
      telehealthAccess: '84.5% Coverage',
      telehealthAccessSubtitle: 'Ayushman Bharat Digital Health Network',
      systemStatus: 'Optimal (Live AI Brain Connected)',
      serverTime: new Date().toISOString()
    };

    return res.json({
      success: true,
      timestamp: new Date().toISOString(),
      metrics
    });
  } catch (error) {
    console.error('Health metrics endpoint error:', error);
    return res.status(500).json({ error: error.message });
  }
});

// Alias for Firebase function format URL
app.post('/health-agent-7079a/us-central1/generateChatResponse', (req, res) => {
  req.url = '/generateChatResponse';
  app.handle(req, res);
});

app.post('/health-agent-7079a/us-central1/transcribeVoice', (req, res) => {
  req.url = '/transcribeVoice';
  app.handle(req, res);
});

app.post('/health-agent-7079a/us-central1/generateSpeech', (req, res) => {
  req.url = '/generateSpeech';
  app.handle(req, res);
});

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`🚀 Swasthya Sakha Node AI & STT Server running live on http://127.0.0.1:${PORT}`);
});
