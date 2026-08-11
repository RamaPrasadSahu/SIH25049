const validateChatRequest = (body) => {
  if (!body || typeof body !== 'object') {
    return { valid: false, message: 'Request body must be a JSON object.' };
  }
  if (!body.message || typeof body.message !== 'string' || !body.message.trim()) {
    return { valid: false, message: 'Field "message" is required and cannot be empty.' };
  }
  return { valid: true };
};

const validateSpeechRequest = (body) => {
  if (!body || typeof body !== 'object') {
    return { valid: false, message: 'Request body must be a JSON object.' };
  }
  if (!body.text || typeof body.text !== 'string' || !body.text.trim()) {
    return { valid: false, message: 'Field "text" is required for text-to-speech.' };
  }
  return { valid: true };
};

const validatePredictionRequest = (body) => {
  if (!body || typeof body !== 'object') {
    return { valid: false, message: 'Request body must be a JSON object.' };
  }
  const features = body.features || body;
  if (!features || typeof features !== 'object') {
    return { valid: false, message: 'Prediction features object is required.' };
  }
  return { valid: true, features };
};

module.exports = {
  validateChatRequest,
  validateSpeechRequest,
  validatePredictionRequest
};
