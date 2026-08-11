/**
 * Healthcare Knowledge Base & Retrieval Layer (WHO, ICMR, MoHFW Grounded Information)
 * Integrated with WHO World Health Statistics Report PDF (ISBN 9789240110496)
 */

const HEALTHCARE_KNOWLEDGE = [
  {
    topic: "WHO World Health Statistics Report & SDG Indicators",
    category: "WHO Report (ISBN 9789240110496)",
    source: "WHO World Health Statistics Report 2025/2026 (9789240110496-eng.pdf)",
    symptoms: ["SDG 3 Targets", "Endemic Disease Prevention", "Child Mortality", "Universal Immunization Coverage"],
    prevention: [
      "WHO SDG Target 3.1 & 3.2: Reduce global maternal mortality to < 70 per 100,000 live births and under-5 mortality to < 25 per 1,000",
      "WHO SDG Target 3.3: End epidemics of AIDS, Tuberculosis, Malaria, and neglected tropical diseases (Dengue, Chikungunya) by 2030",
      "WHO SDG Target 3.4: Reduce premature mortality from Non-Communicable Diseases (Diabetes, Hypertension, Cardiovascular) by one third through prevention and treatment",
      "WHO SDG Target 3.b: Support R&D of vaccines and medicines for communicable and non-communicable diseases affecting developing countries"
    ],
    treatmentAdvisory: "Ground all public health advice in early clinical screening at Primary Health Centres (PHCs), essential drug coverage, and continuous monitoring of endemic vector breeding.",
    vaccinationInfo: "Routine infant immunization schedule under WHO Universal Immunization Programme (BCG, OPV, Pentavalent, Rotavirus, Measles-Rubella)."
  },
  {
    topic: "WHO Global & India Health Demographics",
    category: "World Health Statistics (WHO Official Report)",
    source: "WHO World Health Statistics Report (ISBN 9789240110496)",
    symptoms: ["Demographics", "Life Expectancy", "Child Mortality", "Public Health Statistics"],
    prevention: [
      "India Population Profile: 1.24+ Billion citizens; Under 15: 29.4%, Over 60: 8.1%",
      "Life Expectancy (WHO Official Baseline): 65.0 Years",
      "Child Mortality Rate: 56.3 per 1,000 live births",
      "Mobile Connectivity Access for Public Telehealth: 72.0% cellular subscription coverage"
    ],
    treatmentAdvisory: "WHO Sustainable Development Goal (SDG) 3 aims to achieve Universal Health Coverage (UHC), reducing under-5 mortality to less than 25 per 1,000 live births and eliminating endemic malaria and TB by 2030.",
    vaccinationInfo: "WHO Universal Immunization Programme recommendations for neonates and infants."
  },
  {
    topic: "Malaria",
    category: "Vector-Borne Disease",
    source: "NVBDCP / Ministry of Health & Family Welfare India / WHO Report",
    symptoms: ["High fever with chills/rigors", "Profuse sweating", "Headache", "Nausea/vomiting", "Body aches"],
    prevention: [
      "Use insecticide-treated bed nets (ITNs)",
      "Apply insect repellents containing DEET or Picaridin",
      "Eliminate stagnant water around living spaces to prevent Anopheles breeding",
      "Wear full-sleeved clothing during dawn and dusk"
    ],
    treatmentAdvisory: "Seek immediate blood smear or Rapid Diagnostic Test (RDT) at the nearest Primary Health Centre (PHC). Artemisinin-based Combination Therapy (ACT) is recommended under medical supervision.",
    vaccinationInfo: "RTS,S/AS01 and R21/Matrix-M malaria vaccines are approved for high-transmission regions in children."
  },
  {
    topic: "Dengue",
    category: "Vector-Borne Disease",
    source: "National Center for Vector Borne Diseases Control (NCVBDC) / WHO Report",
    symptoms: ["Sudden high fever (104°F)", "Severe severe headache & retro-orbital (behind eye) pain", "Severe joint and muscle pain ('breakbone fever')", "Skin rash", "Mild bleeding (nose/gums)"],
    prevention: [
      "Prevent Aedes mosquito breeding by emptying coolers, pots, and tires weekly",
      "Keep water containers tightly covered",
      "Use mosquito repellent lotions and coils"
    ],
    treatmentAdvisory: "Stay hydrated with Oral Rehydration Solutions (ORS), fresh juices, and water. Avoid NSAIDs like Ibuprofen/Aspirin due to bleeding risk; use Paracetamol for fever management under medical advice. Watch for warning signs like severe abdominal pain or persistent vomiting.",
    vaccinationInfo: "Dengvaxia is available in select countries for individuals with prior confirmed dengue infection."
  },
  {
    topic: "Tuberculosis (TB)",
    category: "Infectious Respiratory Disease",
    source: "Central TB Division / National TB Elimination Program (NTEP) India / WHO Report",
    symptoms: ["Persistent cough lasting more than 2 weeks", "Coughing up blood or sputum", "Unexplained weight loss", "Low-grade evening fever", "Night sweats"],
    prevention: [
      "Ensure proper ventilation in indoor spaces",
      "Cover mouth and nose when coughing or sneezing",
      "Ensure infants receive BCG vaccination at birth"
    ],
    treatmentAdvisory: "Free diagnosis (CBNAAT/TrueNAT) and DOTS treatment are available across all government health centres under Ni-kshay Yojana. Completing the full 6-month regimen is essential to prevent Drug-Resistant TB.",
    vaccinationInfo: "BCG (Bacillus Calmette-Guérin) vaccine is administered to neonates as part of India's Universal Immunization Programme (UIP)."
  },
  {
    topic: "Diabetes Mellitus",
    category: "Non-Communicable Disease (NCD)",
    source: "ICMR Guidelines for Management of Type 2 Diabetes / WHO Report",
    symptoms: ["Increased thirst (polydipsia)", "Frequent urination (polyuria)", "Extreme hunger (polyphagia)", "Unexplained weight loss", "Blurred vision", "Slow-healing sores"],
    prevention: [
      "Maintain a balanced diet rich in whole grains, pulses, and vegetables; minimize refined sugars",
      "Engage in at least 150 minutes of moderate aerobic exercise per week",
      "Routine blood glucose screening after age 30"
    ],
    treatmentAdvisory: "Monitor HbA1c levels regularly. Consult an endocrinologist or medical officer for personalized oral hypoglycemic agents or insulin therapy.",
    vaccinationInfo: "Annual influenza vaccine and pneumococcal vaccine are recommended for diabetic patients."
  },
  {
    topic: "Hypertension",
    category: "Non-Communicable Disease (NCD)",
    source: "India Hypertension Control Initiative (IHCI) / ICMR / WHO Report",
    symptoms: ["Often asymptomatic ('silent killer')", "Morning headache", "Dizziness", "Shortness of breath", "Chest pain in severe cases"],
    prevention: [
      "Reduce dietary sodium intake (< 5g salt per day)",
      "Avoid tobacco products and limit alcohol consumption",
      "Perform regular physical activity and manage stress through Yoga/meditation"
    ],
    treatmentAdvisory: "Maintain regular BP checks (< 140/90 mmHg target). Adhere strictly to prescribed antihypertensive medications.",
    vaccinationInfo: "Standard adult immunization protocol applies."
  }
];

class HealthcareKnowledgeService {
  /**
   * Retrieves relevant health knowledge based on query keywords
   */
  searchKnowledge(query = '') {
    const q = query.toLowerCase();
    const matches = HEALTHCARE_KNOWLEDGE.filter(item => {
      return (
        item.topic.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.symptoms.some(s => s.toLowerCase().includes(q))
      );
    });

    if (matches.length > 0) {
      return matches;
    }

    return HEALTHCARE_KNOWLEDGE.slice(0, 3);
  }

  /**
   * Builds grounded context string to inject into LLM system prompt
   */
  getGroundedContext(query = '') {
    const knowledgeItems = this.searchKnowledge(query);
    return knowledgeItems.map(item => `
=== Source: ${item.source} ===
Topic: ${item.topic} (${item.category})
Key Symptoms/Indicators: ${item.symptoms.join(', ')}
Prevention & Demographic Data: ${item.prevention.join('; ')}
Treatment Advisory: ${item.treatmentAdvisory}
Vaccination/Immunity: ${item.vaccinationInfo}
`).join('\n\n');
  }
}

module.exports = new HealthcareKnowledgeService();
