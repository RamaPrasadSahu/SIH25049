class MedicalSafetyService {
  /**
   * Evaluates prompt and evidence for emergency triage indicators & medical compliance rules
   */
  evaluateMedicalSafety(userQuery, responseText) {
    const q = userQuery.toLowerCase();
    const text = responseText.toLowerCase();

    let containsDiagnosisClaim = false;
    if (text.includes("you definitely have") || text.includes("you are diagnosed with") || text.includes("you have dengue")) {
      containsDiagnosisClaim = true;
    }

    let isEmergency = false;
    const emergencyKeywords = [
      'chest pain', 'severe breathlessness', 'coughing blood', 'bleeding from nose',
      'fever 104', 'unconscious', 'high fever 104', 'ସିଭିଅର ଛାତି ବିନ୍ଧା', 'ସିଭିଅର ଝାଡ଼ା'
    ];

    emergencyKeywords.forEach(kw => {
      if (q.includes(kw) || text.includes(kw)) {
        isEmergency = true;
      }
    });

    let safeResponse = responseText;

    // Replace diagnostic claims with safe educational wording
    if (containsDiagnosisClaim) {
      safeResponse = safeResponse.replace(/you definitely have|you have dengue|you are diagnosed with/gi, "These symptoms can occur with several conditions");
    }

    // Append emergency medical triage advisory if urgent symptoms detected
    if (isEmergency && !safeResponse.includes("EMERGENCY MEDICAL ADVISORY")) {
      safeResponse += `\n\n🚨 **EMERGENCY MEDICAL ADVISORY**: Severe symptoms detected. Please seek urgent evaluation at your nearest Primary Health Centre (PHC), Community Health Centre (CHC), or hospital emergency department immediately.`;
    }

    return safeResponse;
  }
}

module.exports = new MedicalSafetyService();
