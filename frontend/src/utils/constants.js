export const API_BASE_URL = import.meta.env.VITE_FUNCTIONS_BASE_URL || 'http://127.0.0.1:5001/health-agent-7079a/us-central1';

export const DISEASES = [
  { id: 'Malaria', name: 'Malaria', color: '#f59e0b', category: 'Vector-Borne' },
  { id: 'Dengue', name: 'Dengue', color: '#f43f5e', category: 'Vector-Borne' },
  { id: 'Tuberculosis', name: 'Tuberculosis (TB)', color: '#8b5cf6', category: 'Infectious Respiratory' },
  { id: 'Diabetes', name: 'Diabetes Mellitus', color: '#06b6d4', category: 'NCD' },
  { id: 'Hypertension', name: 'Hypertension', color: '#10b981', category: 'NCD' },
  { id: 'Influenza', name: 'Influenza (Flu)', color: '#3b82f6', category: 'Viral' }
];

export const SYMPTOM_OPTIONS = [
  { id: 'fever', label: 'Fever (ଜ୍ଵର)' },
  { id: 'chills', label: 'Chills & Tremors (କମ୍ପ)' },
  { id: 'headache', label: 'Severe Headache (ମୁଣ୍ଡବିନ୍ଧା)' },
  { id: 'cough', label: 'Persistent Cough (କାସ)' },
  { id: 'fatigue', label: 'Severe Fatigue (କ୍ଲାନ୍ତି)' },
  { id: 'joint_pain', label: 'Joint/Muscle Pain (ଗଣ୍ଠି ବିନ୍ଧା)' },
  { id: 'skin_rash', label: 'Skin Rash (ଚର୍ମ କୁଣ୍ଡାଇ ହେବା)' },
  { id: 'weight_loss', label: 'Unexplained Weight Loss' },
  { id: 'night_sweats', label: 'Night Sweats' }
];
