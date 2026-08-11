const axios = require('axios');

class MLService {
  constructor() {
    this.serviceUrl = process.env.ML_SERVICE_URL || 'http://127.0.0.1:5000/predict';
  }

  /**
   * Invokes Python ML prediction service
   */
  async predictDisease(features) {
    try {
      const response = await axios.post(this.serviceUrl, { features }, { timeout: 4000 });
      return response.data;
    } catch (error) {
      console.warn(`ML Service HTTP call failed (${error.message}). Executing in-memory prediction fallback.`);
      return this.fallbackPredict(features);
    }
  }

  /**
   * Fallback deterministic inference engine if the standalone Python Flask server is offline
   */
  fallbackPredict(features) {
    const fever = Number(features.fever || 0);
    const duration = Number(features.fever_duration || 0);
    const chills = Number(features.chills || 0);
    const cough = Number(features.cough || 0);
    const jointPain = Number(features.joint_pain || 0);
    const skinRash = Number(features.skin_rash || 0);
    const weightLoss = Number(features.weight_loss || 0);
    const glucose = Number(features.blood_glucose || 95);
    const sysBp = Number(features.systolic_bp || 120);

    let prediction = "Healthy";
    let confidence = 0.85;
    let riskLevel = "Low";

    if (fever === 1 && duration > 14 && (cough === 1 || weightLoss === 1)) {
      prediction = "Tuberculosis";
      confidence = 0.88;
      riskLevel = "High";
    } else if (fever === 1 && jointPain === 1 && skinRash === 1) {
      prediction = "Dengue";
      confidence = 0.85;
      riskLevel = "High";
    } else if (fever === 1 && chills === 1) {
      prediction = "Malaria";
      confidence = 0.82;
      riskLevel = "High";
    } else if (glucose > 140) {
      prediction = "Diabetes";
      confidence = 0.86;
      riskLevel = "Moderate";
    } else if (sysBp > 140) {
      prediction = "Hypertension";
      confidence = 0.84;
      riskLevel = "Moderate";
    } else if (fever === 1 && cough === 1) {
      prediction = "Influenza";
      confidence = 0.78;
      riskLevel = "Mild";
    }

    return {
      prediction,
      confidence,
      riskLevel,
      probabilities: {
        [prediction]: confidence,
        "Healthy": roundNumber(1 - confidence, 2)
      },
      modelVersion: "1.0.0 (Fallback Rule Engine)"
    };
  }
}

function roundNumber(num, decimals) {
  return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
}

module.exports = new MLService();
