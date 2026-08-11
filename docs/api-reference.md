# API Reference Document - SIH 25049 Backend Services

## Firebase Cloud Functions

### 1. `POST /generateChatResponse`
- **Purpose**: Generates conversational public health advice using RAG knowledge, Gemini LLM, Sarvam translation, and optional ML symptom risk screening.
- **Authentication**: Firebase Authenticated User (or Demo Session)
- **Request Body**:
```json
{
  "message": "ମୋତେ ୩ ଦିନ ହେଲାଣି ଜ୍ଵର ଏବଂ କମ୍ପ ହେଉଛି",
  "conversationHistory": [],
  "language": "or-IN",
  "features": {
    "fever": 1,
    "chills": 1,
    "fever_duration": 3
  }
}
```
- **Response**:
```json
{
  "success": true,
  "reply": "ଜ୍ଵର ଏବଂ କମ୍ପ ମ୍ୟାଲେରିଆ (Malaria) ର ଲକ୍ଷଣ ହୋଇପାରେ...",
  "language": "or-IN",
  "mlRiskAssessment": {
    "prediction": "Malaria",
    "confidence": 0.82,
    "riskLevel": "High"
  },
  "timestamp": "2026-08-10T23:15:00Z"
}
```

### 2. `POST /transcribeVoice`
- **Purpose**: Transcribes user speech audio to text via Sarvam AI STT (`saaras:v3`).
- **Request Body**:
```json
{
  "audioBase64": "UklGRi...",
  "languageCode": "or-IN"
}
```

### 3. `POST /generateSpeech`
- **Purpose**: Converts AI response text into natural audio via Sarvam AI TTS (`bulbul:v1`).
- **Request Body**:
```json
{
  "text": "Hello, stay hydrated and rest.",
  "targetLanguageCode": "hi-IN",
  "speaker": "meera"
}
```

### 4. `POST /runPrediction`
- **Purpose**: Invokes Python ML model prediction microservice.
- **Request Body**:
```json
{
  "features": {
    "age": 35,
    "gender": "Male",
    "fever": 1,
    "chills": 1,
    "fever_duration": 4
  }
}
```
