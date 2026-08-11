import os
import joblib
import pandas as pd
from sklearn.metrics import classification_report, confusion_matrix
from preprocess import preprocess_data

def evaluate_saved_model():
    models_dir = "ml/models"
    model_path = os.path.join(models_dir, "model.pkl")
    scaler_path = os.path.join(models_dir, "scaler.pkl")
    encoders_path = os.path.join(models_dir, "encoders.pkl")
    features_path = os.path.join(models_dir, "feature_cols.pkl")
    
    if not all(os.path.exists(p) for p in [model_path, scaler_path, encoders_path, features_path]):
        print("Model artifacts missing. Train the model first via train.py.")
        return
        
    model = joblib.load(model_path)
    encoders = joblib.load(encoders_path)
    feature_cols = joblib.load(features_path)
    
    df_raw = pd.read_csv("ml/data/raw/public_health_disease_data.csv")
    df_processed, _, _, _ = preprocess_data(df_raw)
    
    X = df_processed[feature_cols]
    y = df_processed["target"]
    
    preds = model.predict(X)
    target_names = list(encoders["target"].classes_)
    
    print("================ DETAILED CLASSIFICATION REPORT ================")
    print(classification_report(y, preds, target_names=target_names))
    
    print("\n================ CONFUSION MATRIX ================")
    cm = confusion_matrix(y, preds)
    cm_df = pd.DataFrame(cm, index=target_names, columns=target_names)
    print(cm_df)

if __name__ == "__main__":
    evaluate_saved_model()
