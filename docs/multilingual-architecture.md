# Multilingual Architecture & Voice Engine - SIH 25049

## Overview
India is a linguistically diverse nation with over 22 official languages. To bridge healthcare access barriers, **Swasthya Sahayak** implements a multi-tier language abstraction layer using **Sarvam AI APIs**.

## Supported Languages
- English (`en-IN`)
- Hindi (`hi-IN`)
- Odia (`or-IN`)
- Bengali (`bn-IN`)
- Marathi (`mr-IN`)
- Gujarati (`gu-IN`)
- Punjabi (`pa-IN`)
- Tamil (`ta-IN`)
- Telugu (`te-IN`)
- Kannada (`kn-IN`)
- Malayalam (`ml-IN`)
- Assamese (`as-IN`)

## Translation Pipeline
1. **User Input Normalization**: User speaks or types in native language (e.g. Odia).
2. **Speech-to-Text**: Audio buffer sent to Sarvam `saaras:v3` returns native text transcript.
3. **Indic-to-English**: Sarvam `mayura:v1` translates native text to English for precise vector retrieval (RAG) and Gemini LLM reasoning.
4. **AI Generation**: Gemini LLM produces grounded public health response with medical disclaimers.
5. **English-to-Indic**: Sarvam `mayura:v1` translates response back to original native language.
6. **Text-to-Speech**: Sarvam `bulbul:v1` generates audio waveform for voice playback.
