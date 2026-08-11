# Deployment Guide - SIH 25049 Prototype

## 1. Prerequisites
- Node.js 18+
- Python 3.10+
- Firebase CLI (`npm install -g firebase-tools`)

## 2. ML Prediction Microservice Setup
```bash
python -m venv venv
venv\Scripts\activate
pip install -r ml/requirements.txt
python ml/src/train.py
python ml/src/serve.py
```
The ML microservice will start on `http://127.0.0.1:5000/predict`.

## 3. Firebase Cloud Functions Setup
```bash
cd functions
npm install
firebase emulators:start
```

## 4. React Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:3000` in browser.
