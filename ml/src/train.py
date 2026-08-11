import os
import joblib
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score

from preprocess import generate_synthetic_dataset, preprocess_data

def train_and_evaluate_models():
    data_path = "ml/data/raw/public_health_disease_data.csv"
    if not os.path.exists(data_path):
        df_raw = generate_synthetic_dataset(output_path=data_path)
    else:
        df_raw = pd.read_csv(data_path)
        
    df_processed, feature_cols, scaler, encoders = preprocess_data(df_raw)
    
    X = df_processed[feature_cols]
    y = df_processed["target"]
    
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    
    candidates = {
        "RandomForest": RandomForestClassifier(n_estimators=100, max_depth=10, random_state=42),
        "GradientBoosting": GradientBoostingClassifier(n_estimators=100, learning_rate=0.1, max_depth=5, random_state=42),
        "LogisticRegression": LogisticRegression(max_iter=1000, random_state=42)
    }
    
    best_model_name = None
    best_model = None
    best_f1 = -1.0
    evaluation_summary = {}
    
    print("\n================ ML MODEL CANDIDATE EVALUATION ================")
    for name, model in candidates.items():
        model.fit(X_train, y_train)
        preds = model.predict(X_test)
        
        acc = accuracy_score(y_test, preds)
        prec = precision_score(y_test, preds, average="weighted")
        rec = recall_score(y_test, preds, average="weighted")
        f1 = f1_score(y_test, preds, average="weighted")
        
        evaluation_summary[name] = {
            "accuracy": round(acc, 4),
            "precision": round(prec, 4),
            "recall": round(rec, 4),
            "f1_score": round(f1, 4)
        }
        
        print(f"Model: {name:<20} | Acc: {acc:.4f} | Prec: {prec:.4f} | Rec: {rec:.4f} | F1: {f1:.4f}")
        
        if f1 > best_f1:
            best_f1 = f1
            best_model_name = name
            best_model = model
            
    print(f"\n---> Selected Best Model: {best_model_name} (F1 Score: {best_f1:.4f})")
    
    # Save artifacts
    models_dir = "ml/models"
    os.makedirs(models_dir, exist_ok=True)
    
    joblib.dump(best_model, os.path.join(models_dir, "model.pkl"))
    joblib.dump(scaler, os.path.join(models_dir, "scaler.pkl"))
    joblib.dump(encoders, os.path.join(models_dir, "encoders.pkl"))
    joblib.dump(feature_cols, os.path.join(models_dir, "feature_cols.pkl"))
    
    print(f"Saved model artifacts into '{models_dir}/'")
    return best_model_name, evaluation_summary

if __name__ == "__main__":
    train_and_evaluate_models()
