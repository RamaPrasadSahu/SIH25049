# SIH 25049 - Comprehensive System Architecture Document

## Executive Vision
**SIH Problem Statement 25049** requires an AI-driven, multilingual public health chatbot for disease awareness, symptom screening, and healthcare education across India.

The solution integrates:
1. **React + Vite Frontend**: High-performance ChatGPT-style conversational UI with dark mode glassmorphism theme, voice recording indicator, audio player, and real-time disease risk charts.
2. **Firebase Backend**: Firebase Auth, Firestore Database, and Firebase Cloud Functions (v2) for secure secret key handling and API proxying.
3. **Sarvam AI Engine**: State-of-the-art Indic speech-to-text (`saaras:v3`), text-to-speech (`bulbul:v1`), and translation (`mayura:v1`) supporting 12+ Indian languages.
4. **Google Gemini LLM**: Natural language conversation grounded in official public health guidelines (WHO, ICMR, MoHFW, NTEP, NCVBDC).
5. **In-House ML Microservice**: Scikit-learn disease risk predictor (`RandomForestClassifier`, 95.8% F1 score) screening Malaria, Dengue, TB, Diabetes, and Hypertension.

## End-to-End Voice & Multilingual Flow

```text
User Speech (Odia / Hindi / etc.)
       │
       ▼
Browser MediaRecorder API
       │ (Base64 audio)
       ▼
Firebase Cloud Function (transcribeVoice)
       │
       ▼
Sarvam STT API (saaras:v3)
       │ (Transcribed Text + Detected Language)
       ▼
Sarvam Translation API (mayura:v1) -> English
       │
       ▼
Healthcare Knowledge Layer (RAG) + In-House Python ML Model
       │
       ▼
Google Gemini LLM (generateChatResponse)
       │ (Grounded Response + Safety Disclaimer)
       ▼
Sarvam Translation API (mayura:v1) -> User's Original Language
       │
       ▼
Sarvam TTS API (bulbul:v1) -> Base64 Audio
       │
       ▼
React Frontend Audio Player & Message Bubble
```
