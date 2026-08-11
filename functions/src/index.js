const { generateChatResponse } = require('./functions/chat');
const { transcribeVoice, generateSpeech } = require('./functions/speech');
const { translateText, detectLanguage } = require('./functions/translation');
const { runPrediction } = require('./functions/prediction');

module.exports = {
  generateChatResponse,
  transcribeVoice,
  generateSpeech,
  translateText,
  detectLanguage,
  runPrediction
};
