import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from predict import DiseasePredictor

app = Flask(__name__)
CORS(app)

predictor = None

def get_predictor():
    global predictor
    if predictor is None:
        models_dir = os.environ.get("MODELS_DIR", "ml/models")
        predictor = DiseasePredictor(models_dir=models_dir)
    return predictor

@app.route("/health", methods=["GET"])
def health_check():
    return jsonify({
        "status": "healthy",
        "service": "SIH 25049 Public Health ML Microservice",
        "version": "1.0.0"
    })

@app.route("/predict", methods=["POST"])
def predict_endpoint():
    try:
        data = request.get_json(force=True)
        if not data:
            return jsonify({"error": "Invalid request payload. Expected JSON."}), 400
            
        features = data.get("features", data)
        
        pred_service = get_predictor()
        result = pred_service.predict(features)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    print(f"Starting ML Prediction Microservice on port {port}...")
    app.run(host="0.0.0.0", port=port, debug=False)
