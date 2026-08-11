import os
import joblib
import pandas as pd
import numpy as np

class DiseasePredictor:
    def __init__(self, models_dir="ml/models"):
        self.model_path = os.path.join(models_dir, "model.pkl")
        self.scaler_path = os.path.join(models_dir, "scaler.pkl")
        self.encoders_path = os.path.join(models_dir, "encoders.pkl")
        self.features_path = os.path.join(models_dir, "feature_cols.pkl")
        
        self.model = None
        self.scaler = None
        self.encoders = None
        self.feature_cols = None
        
        self.load_artifacts()
        
    def load_artifacts(self):
        if not os.path.exists(self.model_path):
            raise FileNotFoundError(f"Model file not found at {self.model_path}")
            
        self.model = joblib.load(self.model_path)
        self.scaler = joblib.load(self.scaler_path)
        self.encoders = joblib.load(self.encoders_path)
        self.feature_cols = joblib.load(self.features_path)
        
    def predict(self, sample_input: dict):
        df = pd.DataFrame([sample_input])
        
        # Categorical encoding
        for col in ["gender", "locality", "season"]:
            le = self.encoders[col]
            val = str(df[col].values[0]) if col in df.columns else "Rural"
            if val in le.classes_:
                df[col] = le.transform([val])
            else:
                df[col] = 0
                
        # Fill defaults for missing feature columns
        for col in self.feature_cols:
            if col not in df.columns:
                df[col] = 0
                
        df = df[self.feature_cols]
        
        # Standard scaling
        scaled_array = self.scaler.transform(df)
        scaled_df = pd.DataFrame(scaled_array, columns=self.feature_cols)
        
        # Model prediction
        pred_class_idx = self.model.predict(scaled_df)[0]
        probabilities = self.model.predict_proba(scaled_df)[0]
        
        target_encoder = self.encoders["target"]
        predicted_disease = str(target_encoder.inverse_transform([pred_class_idx])[0])
        confidence = float(probabilities[pred_class_idx])
        
        # Risk assessment classification
        if predicted_disease == "Healthy":
            risk_level = "Low"
        elif confidence >= 0.70:
            risk_level = "High"
        elif confidence >= 0.40:
            risk_level = "Moderate"
        else:
            risk_level = "Mild"
            
        all_prob_dict = {
            str(target_encoder.inverse_transform([i])[0]): round(float(prob), 4)
            for i, prob in enumerate(probabilities)
        }
        
        return {
            "prediction": predicted_disease,
            "confidence": round(confidence, 4),
            "riskLevel": risk_level,
            "probabilities": all_prob_dict,
            "modelVersion": "1.0.0"
        }

if __name__ == "__main__":
    predictor = DiseasePredictor()
    sample = {
        "age": 35,
        "gender": "Male",
        "locality": "Rural",
        "season": "Monsoon",
        "fever": 1,
        "fever_duration": 4,
        "chills": 1,
        "headache": 1,
        "cough": 0,
        "fatigue": 1,
        "joint_pain": 1,
        "skin_rash": 0,
        "weight_loss": 0,
        "night_sweats": 0,
        "blood_glucose": 98.0,
        "systolic_bp": 122.0,
        "diastolic_bp": 80.0
    }
    res = predictor.predict(sample)
    print("Clean Test Prediction Output:", res)
