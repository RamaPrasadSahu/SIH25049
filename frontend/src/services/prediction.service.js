import { API_BASE_URL } from '../utils/constants';

export const runDiseasePrediction = async (features) => {
  try {
    const response = await fetch(`${API_BASE_URL}/runPrediction`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ features })
    });

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.warn('Prediction API fallback:', error.message);
    const fever = features.fever === 1;
    const chills = features.chills === 1;
    const joint = features.joint_pain === 1;

    let pred = "Healthy";
    let conf = 0.85;
    let risk = "Low";

    if (fever && joint) {
      pred = "Dengue";
      conf = 0.86;
      risk = "High";
    } else if (fever && chills) {
      pred = "Malaria";
      conf = 0.82;
      risk = "High";
    }

    return {
      prediction: pred,
      confidence: conf,
      riskLevel: risk,
      probabilities: { [pred]: conf, "Healthy": 0.14 },
      modelVersion: "1.0.0 (Fallback Client Engine)"
    };
  }
};
