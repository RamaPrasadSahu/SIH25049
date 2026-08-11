# SIH 25049 Firebase Cloud Functions Backend

This service hosts the serverless API layer connecting the React Frontend with Sarvam AI, Google Gemini LLM, and the Python ML Prediction Engine.

## Exported Functions
- `generateChatResponse` (HTTP POST): Main conversational entry point combining RAG knowledge, Gemini LLM, and Sarvam translation.
- `transcribeVoice` (HTTP POST): Sarvam AI Speech-to-Text (`saaras:v3`).
- `generateSpeech` (HTTP POST): Sarvam AI Text-to-Speech (`bulbul:v1`).
- `translateText` (HTTP POST): Sarvam AI Translation (`mayura:v1`).
- `detectLanguage` (HTTP POST): Sarvam AI Language Identification (`text-lid`).
- `runPrediction` (HTTP POST): Python ML Disease Risk Microservice bridge.

## Environment Configuration
Set environment secrets before local emulation or cloud deployment:
```bash
SARVAM_API_KEY=your_key
GEMINI_API_KEY=your_key
ML_SERVICE_URL=http://127.0.0.1:5000/predict
```
