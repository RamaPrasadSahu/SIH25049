# Swasthya Sakha (स्वास्थ्य सखा / ସ୍ୱାସ୍ଥ୍ୟ ସଖା)
## AI-Driven Multilingual Public Health Chatbot for Disease Awareness (SIH 25049)

![SIH 25049](https://img.shields.io/badge/SIH-2025%2F2026-blue)
![React](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-06b6d4)
![Firebase](https://img.shields.io/badge/Backend-Firebase%20Functions-ffca28)
![Sarvam AI](https://img.shields.io/badge/Voice%2FTranslation-Sarvam%20AI-10b981)
![Scikit-Learn](https://img.shields.io/badge/ML%20Model-Scikit--Learn-f59e0b)

> **Problem Statement ID**: SIH 25049  
> **Organization**: Government of Odisha (Electronics & IT Department)  
> **Theme**: MedTech / BioTech / HealthTech  

---

## 🌟 Key Differentiator & Capabilities
Citizens across urban, semi-urban, and rural India can communicate naturally with the healthcare system in their native language (**Odia, Hindi, Bengali, Marathi, Tamil, Telugu, Gujarati, etc.**) through both **text and voice**.

- **ChatGPT-Style Conversational Interface**: Responsive glassmorphism chat UI with audio playback, voice recording, typing indicators, and quick symptom screening.
- **Sarvam AI Voice & Multilingual Engine**: Speech-to-Text (`saaras:v3`), Text-to-Speech (`bulbul:v1`), and Translation (`mayura:v1`).
- **Grounded Healthcare Knowledge Layer**: WHO, ICMR, and MoHFW grounded advice, Universal Immunization Programme (UIP) schedules, and NTEP TB elimination guidelines with strict medical safety disclaimers.
- **In-House ML Risk Prediction Model**: `RandomForestClassifier` trained on 1,200+ clinical sample records achieving **95.8% weighted F1-score** for Malaria, Dengue, TB, Diabetes, and Hypertension screening.
- **Public Health Analytics Dashboard**: Real-time outbreak warning banners, health card metrics, and interactive disease probability spectrum charts.

---

## 🏗️ Project Architecture

```text
Health Agent/
├── frontend/         # React + Vite Chat UI, Voice Recorder, Health Dashboard
├── functions/        # Firebase Cloud Functions (v2) serverless API layer
├── ml/               # Python ML model training, preprocessing & Flask REST service
├── docs/             # Comprehensive technical, database, and API documentation
├── firebase.json     # Firebase deployment & emulator suite configuration
├── firestore.rules   # Secure user data isolation rules
└── README.md
```

---

## 🚀 Quick Start Guide

### 1. Train & Launch Python ML Microservice
```bash
python ml/src/train.py
python ml/src/serve.py
```

### 2. Launch Firebase Cloud Functions Backend
```bash
cd functions
npm install
npm run serve
```

### 3. Launch React Frontend App
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:3000` in your web browser.

---

## 🔒 Medical & Security Compliance
This application provides public health awareness and preliminary symptom screening. It explicitly communicates that it is **not a clinical replacement for a qualified medical practitioner** and encourages consulting Primary Health Centres (PHC) for diagnostic evaluation.
