import os
import json
import pandas as pd

def process_who_csv(csv_path="D:/Dataset/WHO.csv", output_json="ml/data/processed/who_health_statistics.json"):
    if not os.path.exists(csv_path):
        print(f"File not found at {csv_path}")
        return
        
    df = pd.read_csv(csv_path)
    
    # Clean string columns
    for col in df.columns:
        if df[col].dtype == 'object':
            df[col] = df[col].astype(str).str.strip().str.replace('\n', '').str.replace('"', '')
            
    # Extract India and South-East Asia / Global summaries
    india_data = df[df['Country'].str.contains('India', case=False, na=False)].to_dict(orient='records')
    
    summary = {
        "dataset": "WHO World Health Statistics",
        "totalCountries": len(df),
        "columns": df.columns.tolist(),
        "indiaProfile": india_data[0] if india_data else {},
        "regionalAverages": df.groupby('Region')[['LifeExpectancy', 'ChildMortality']].mean(numeric_only=True).round(2).to_dict()
    }
    
    os.makedirs(os.path.dirname(output_json), exist_ok=True)
    with open(output_json, 'w', encoding='utf-8') as f:
        json.dump(summary, f, indent=2)
        
    print(f"Processed WHO statistics saved to {output_json}")
    return summary

if __name__ == "__main__":
    process_who_csv()
