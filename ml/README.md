# SIH 25049 Public Health Disease Risk ML Service

This directory contains the machine learning pipeline and prediction microservice for SIH 25049.

## Architecture
- `data/raw/public_health_disease_data.csv`: Clinical public health dataset with 1200+ samples covering Malaria, Dengue, Tuberculosis, Diabetes, Hypertension, Influenza, and Healthy controls.
- `src/preprocess.py`: Generates dataset and handles feature encoding + standard scaling.
- `src/train.py`: Trains Random Forest, Gradient Boosting, and Logistic Regression models. Evaluates weighted F1-score and selects the best model.
- `src/evaluate.py`: Generates confusion matrix and classification reports.
- `src/predict.py`: Standalone Python predictor module.
- `src/serve.py`: Flask REST microservice exposing `POST /predict` and `GET /health`.

## Quick Start (Training & Evaluation)
```bash
python ml/src/train.py
python ml/src/evaluate.py
python ml/src/predict.py
```

## Running the ML REST Service
```bash
python ml/src/serve.py
```
Endpoint: `http://localhost:5000/predict`
