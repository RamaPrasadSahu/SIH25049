import os
import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler, LabelEncoder

def generate_synthetic_dataset(num_samples=1200, output_path="ml/data/raw/public_health_disease_data.csv"):
    """
    Generates a realistic clinical public health dataset tailored for Indian epidemiological patterns
    (Dengue, Malaria, Tuberculosis, Diabetes, Hypertension, Influenza, Healthy).
    """
    np.random.seed(42)
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    diseases = ["Malaria", "Dengue", "Tuberculosis", "Diabetes", "Hypertension", "Influenza", "Healthy"]
    probabilities = [0.18, 0.18, 0.12, 0.15, 0.15, 0.12, 0.10]
    
    selected_diseases = np.random.choice(diseases, size=num_samples, p=probabilities)
    
    data = []
    for d in selected_diseases:
        age = np.random.randint(12, 80)
        gender = np.random.choice(["Male", "Female"])
        locality = np.random.choice(["Rural", "Semi-Urban", "Urban"], p=[0.5, 0.3, 0.2])
        season = np.random.choice(["Monsoon", "Summer", "Winter"], p=[0.45, 0.30, 0.25])
        
        # Default symptom profile
        fever = 0
        fever_duration = 0
        chills = 0
        headache = 0
        cough = 0
        fatigue = 0
        joint_pain = 0
        skin_rash = 0
        weight_loss = 0
        night_sweats = 0
        blood_glucose = np.random.normal(95, 10)  # mg/dL
        systolic_bp = np.random.normal(120, 10)    # mmHg
        diastolic_bp = np.random.normal(80, 8)     # mmHg
        
        if d == "Malaria":
            fever = 1
            fever_duration = np.random.randint(2, 7)
            chills = np.random.choice([1, 0], p=[0.9, 0.1])
            headache = np.random.choice([1, 0], p=[0.8, 0.2])
            fatigue = 1
            joint_pain = np.random.choice([1, 0], p=[0.6, 0.4])
            season = np.random.choice(["Monsoon", "Summer", "Winter"], p=[0.7, 0.2, 0.1])
        elif d == "Dengue":
            fever = 1
            fever_duration = np.random.randint(3, 8)
            chills = np.random.choice([1, 0], p=[0.7, 0.3])
            headache = np.random.choice([1, 0], p=[0.9, 0.1])
            fatigue = 1
            joint_pain = np.random.choice([1, 0], p=[0.95, 0.05]) # High joint pain / breakbone fever
            skin_rash = np.random.choice([1, 0], p=[0.75, 0.25])
            season = np.random.choice(["Monsoon", "Summer", "Winter"], p=[0.75, 0.2, 0.05])
        elif d == "Tuberculosis":
            cough = 1
            fever = np.random.choice([1, 0], p=[0.8, 0.2])
            fever_duration = np.random.randint(14, 45) # Long duration fever
            fatigue = 1
            weight_loss = np.random.choice([1, 0], p=[0.85, 0.15])
            night_sweats = np.random.choice([1, 0], p=[0.80, 0.20])
        elif d == "Diabetes":
            blood_glucose = np.random.normal(175, 35) # High blood glucose
            fatigue = np.random.choice([1, 0], p=[0.7, 0.3])
            weight_loss = np.random.choice([1, 0], p=[0.4, 0.6])
        elif d == "Hypertension":
            systolic_bp = np.random.normal(152, 18)
            diastolic_bp = np.random.normal(96, 12)
            headache = np.random.choice([1, 0], p=[0.65, 0.35])
            fatigue = np.random.choice([1, 0], p=[0.5, 0.5])
        elif d == "Influenza":
            fever = 1
            fever_duration = np.random.randint(1, 5)
            cough = 1
            chills = np.random.choice([1, 0], p=[0.6, 0.4])
            headache = 1
            fatigue = 1
            joint_pain = np.random.choice([1, 0], p=[0.5, 0.5])
            season = np.random.choice(["Winter", "Monsoon", "Summer"], p=[0.6, 0.3, 0.1])
            
        data.append({
            "age": age,
            "gender": gender,
            "locality": locality,
            "season": season,
            "fever": fever,
            "fever_duration": fever_duration,
            "chills": chills,
            "headache": headache,
            "cough": cough,
            "fatigue": fatigue,
            "joint_pain": joint_pain,
            "skin_rash": skin_rash,
            "weight_loss": weight_loss,
            "night_sweats": night_sweats,
            "blood_glucose": round(max(60, blood_glucose), 1),
            "systolic_bp": round(max(80, systolic_bp), 1),
            "diastolic_bp": round(max(50, diastolic_bp), 1),
            "disease": d
        })
        
    df = pd.DataFrame(data)
    df.to_csv(output_path, index=False)
    print(f"Generated synthetic dataset with {num_samples} records at {output_path}")
    return df

def preprocess_data(df):
    """
    Cleans data, encodes categorical features, and standardizes continuous numerical attributes.
    """
    df = df.copy()
    
    # Fill missing values if any
    numerical_cols = ["age", "fever_duration", "blood_glucose", "systolic_bp", "diastolic_bp"]
    for col in numerical_cols:
        df[col] = df[col].fillna(df[col].median())
        
    binary_cols = ["fever", "chills", "headache", "cough", "fatigue", "joint_pain", "skin_rash", "weight_loss", "night_sweats"]
    for col in binary_cols:
        df[col] = df[col].fillna(0).astype(int)
        
    encoders = {}
    categorical_cols = ["gender", "locality", "season"]
    for col in categorical_cols:
        le = LabelEncoder()
        df[col] = le.fit_transform(df[col].astype(str))
        encoders[col] = le
        
    target_encoder = LabelEncoder()
    df["target"] = target_encoder.fit_transform(df["disease"])
    encoders["target"] = target_encoder
    
    feature_cols = [c for c in df.columns if c not in ["disease", "target"]]
    
    scaler = StandardScaler()
    df[feature_cols] = scaler.fit_transform(df[feature_cols])
    
    return df, feature_cols, scaler, encoders

if __name__ == "__main__":
    df = generate_synthetic_dataset()
    processed_df, features, scaler, encoders = preprocess_data(df)
    print("Preprocessing completed successfully. Features:", features)
