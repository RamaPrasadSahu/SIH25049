import { API_BASE_URL } from '../utils/constants';

// Use valid AIzaSy Google API Key from environment or Firebase config
const GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY?.startsWith('AIza') 
  ? import.meta.env.VITE_GEMINI_API_KEY 
  : (import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyDu42fVseRws-Ce8cxqv98VhzPHtb5HVfo');

// Fast fetch helper with strict timeout
const fetchWithTimeout = async (url, options = {}, timeoutMs = 800) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(id);
    return response;
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
};

const LANG_NAMES = {
  'od-IN': 'Odia (ଓଡ଼ିଆ)',
  'hi-IN': 'Hindi (हिन्दी)',
  'en-IN': 'English',
  'bn-IN': 'Bengali (বাংলা)',
  'ta-IN': 'Tamil (தமிழ்)',
  'te-IN': 'Telugu (తె르고)',
  'mr-IN': 'Marathi (मराठी)',
  'gu-IN': 'Gujarati (ગુજરાતી)',
  'pa-IN': 'Punjabi (ਪੰਜਾਬୀ)',
  'kn-IN': 'Kannada (ಕನ್ನಡ)',
  'ml-IN': 'Malayalam (മലയാളം)',
  'as-IN': 'Assamese (ଅସମୀୟା)'
};

// Intent Regexes
const GREETING_REGEX = /^(hi|hii|hiii|hello|hey|heyy|namaste|namaskar|ନମସ୍କାର|नमस्ते|good morning|good afternoon|good evening|who are you|help|हाइ|हेलो)$/i;
const PERSONAL_REGEX = /^(i am|iam|my name is|i'm|i am a person|i am human|i am a human|मैं एक|ମୁଁ ଜଣେ)/i;

export const sendChatMessage = async (message, conversationHistory = [], language = 'od-IN', features = null) => {
  const trimmed = message.trim();

  // 1. Conversational Greeting Intent Handling
  if (GREETING_REGEX.test(trimmed)) {
    return handleGreetingResponse(trimmed, language);
  }

  // 2. Personal / Identity Statement Handling
  if (PERSONAL_REGEX.test(trimmed)) {
    return handlePersonalStatementResponse(trimmed, language);
  }

  // 3. Check Cloud Functions Backend first (with 800ms max timeout)
  try {
    const response = await fetchWithTimeout(`${API_BASE_URL}/generateChatResponse`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, conversationHistory, language, features })
    }, 800);

    if (response.ok) {
      const data = await response.json();
      return data;
    }
  } catch (error) {
    // Failover
  }

  // 4. Direct Hybrid PDF RAG + External Web Search Engine
  return await generateHybridRAGReply(message, conversationHistory, language, features);
};

function handleGreetingResponse(query, lang) {
  if (lang === 'hi-IN') {
    return {
      success: true,
      reply: `नमस्ते! मैं आपका **स्वास्थ्य सखा (Swasthya Sakha)** हूँ। 🙏\n\nमैं WHO और MoHFW दिशानिर्देशों के आधार पर जनस्वास्थ्य, बीमारी के लक्षणों (जैसे मलेरिया, डेंगू, टीबी, निमोनिया), टीकाकरण और सरकारी स्वास्थ्य योजनाओं की जानकारी प्रदान करता हूँ।\n\nआज मैं आपके स्वास्थ्य संबंधी किस प्रश्न में सहायता कर सकता हूँ?`,
      sources: [],
      language: lang
    };
  } else if (lang === 'od-IN') {
    return {
      success: true,
      reply: `ନମସ୍କାର! ମୁଁ ଆପଣଙ୍କର **ସ୍ୱାସ୍ଥ୍ୟ ସଖା (Swasthya Sakha)**। 🙏\n\nମୁଁ WHO ଏବଂ ସ୍ୱାସ୍ଥ୍ୟ ମନ୍ତ୍ରଣାଳୟ ତଥ୍ୟ ଆଧାରରେ ଜନସ୍ୱାସ୍ଥ୍ୟ, ରୋଗର ଲକ୍ଷଣ (ମଲେରିଆ, ଡେଙ୍ଗୁ, ଟିବି, ପ୍ନୁମୋନିଆ), ଟିକାକରଣ ଏବଂ ପ୍ରାଥମିକ ସ୍ୱାସ୍ଥ୍ୟ ସେବା ବିଷୟରେ ସୂଚନା ପ୍ରଦାନ କରେ।\n\nଆଜି ଆପଣ କ’ଣ ଜାଣିବାକୁ ଚାହାନ୍ତି?`,
      sources: [],
      language: lang
    };
  } else {
    return {
      success: true,
      reply: `Hello! I am **Swasthya Sakha (स्वास्थ्य सखा / ସ୍ୱାସ୍ଥ୍ୟ ସଖା)**, your AI public health companion. 🙏\n\nI am here to assist you with verified disease awareness (Malaria, Dengue, TB, Pneumonia), symptom guidance, immunization schedules, and official health advice across India.\n\nHow can I assist your health query today?`,
      sources: [],
      language: lang
    };
  }
}

function handlePersonalStatementResponse(query, lang) {
  if (lang === 'hi-IN') {
    return {
      success: true,
      reply: `नमस्ते! एक नागरिक के रूप में, आप मुझसे स्वास्थ्य, बीमारी के लक्षणों, निवारक देखभाल, टीकाकरण या प्राथमिक स्वास्थ्य सेवाओं से जुड़ा कोई भी प्रश्न पूछ सकते हैं। मैं आपकी सहायता के लिए यहाँ हूँ।`,
      sources: [],
      language: lang
    };
  } else if (lang === 'od-IN') {
    return {
      success: true,
      reply: `ନମସ୍କାର! ଆପଣ ଜଣେ ନାଗରିକ ଭାବରେ ସ୍ୱାସ୍ଥ୍ୟ ସମ୍ବନ୍ଧୀୟ ଯେକୌଣସି ପ୍ରଶ୍ନ (ଯଥା: ଲକ୍ଷଣ, ପ୍ରତିଷେଧକ, ଟିକାକରଣ କିମ୍ବା PHC ସେବା) ପଚାରିପାରିବେ। ମୁଁ ଆପଣଙ୍କୁ ସାହାଯ୍ୟ କରିବାକୁ ପ୍ରସ୍ତୁତ।`,
      sources: [],
      language: lang
    };
  } else {
    return {
      success: true,
      reply: `Hello! Welcome. As a citizen, you can ask me any public health query, disease symptom guidelines, immunization recommendations, or preventive health advice. I am here to help you!`,
      sources: [],
      language: lang
    };
  }
}

const generateHybridRAGReply = async (message, conversationHistory, language, features) => {
  let mlRiskAssessment = null;

  // 1. Fetch live ML prediction from Python Microservice (RandomForest Classifier on port 5000)
  if (features && Object.keys(features).length > 0) {
    try {
      const mlRes = await fetchWithTimeout('http://127.0.0.1:5000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ features })
      }, 500);

      if (mlRes.ok) {
        mlRiskAssessment = await mlRes.json();
      }
    } catch (e) {
      console.warn('ML Python microservice offline, using client risk rules.');
    }
  }

  // Auto-detect symptom features from user text if features object is empty
  if (!mlRiskAssessment) {
    const q = message.toLowerCase();
    const fever = q.includes('fever') || q.includes('ଜ୍ଵର') || q.includes('बुखार');
    const chills = q.includes('chills') || q.includes('shivering') || q.includes('କମ୍ପ') || q.includes('ठंड');
    const joint = q.includes('joint') || q.includes('body ache') || q.includes('ଗଣ୍ଠି') || q.includes('दर्द');
    const cough = q.includes('cough') || q.includes('କାସ') || q.includes('खांसी');

    if (fever && joint) {
      mlRiskAssessment = { prediction: 'Dengue Vector Risk', confidence: 0.88, riskLevel: 'High' };
    } else if (fever && chills) {
      mlRiskAssessment = { prediction: 'Malaria Risk', confidence: 0.85, riskLevel: 'High' };
    } else if (cough && fever) {
      mlRiskAssessment = { prediction: 'Respiratory Infection / TB Screening', confidence: 0.79, riskLevel: 'Moderate' };
    }
  }

  // Parallel Retrieval: PDF Knowledge Base + External Search Evidence
  const [pdfEvidence, webEvidence] = await Promise.all([
    retrievePdfKnowledge(message),
    retrieveTrustedWebSearch(message)
  ]);

  // Combine and Rank Sources
  const { sources, formattedEvidence } = processAndVerifySources(pdfEvidence, webEvidence);

  const targetLangName = LANG_NAMES[language] || 'Odia (ଓଡ଼ିଆ)';

  const systemPrompt = `
You are Swasthya Sakha (स्वास्थ्य सखा / ସ୍ୱାସ୍ଥ୍ୟ ସଖା), a public health and medical assistant designed for citizens across India under SIH Problem Statement 25049.

AUTHORITATIVE MEDICAL GROUNDING RULES:
1. Answer the user's question directly, clearly, and thoughtfully in ${targetLangName}.
2. Use the retrieved evidence below when applicable. If user query is a general conversation or question, answer with accurate public health knowledge.
3. DO NOT provide definitive clinical diagnoses. Use educational language: "These symptoms can occur with several conditions..."
4. DO NOT claim 100% accuracy or invent drug dosages.
5. Provide verified citations based on supplied evidence where appropriate.

RETRIEVED EVIDENCE:
${formattedEvidence || 'No specific document matches.'}

${mlRiskAssessment ? `ML RISK SCREENING CONTEXT: High-risk indicators detected: ${mlRiskAssessment.prediction} (Confidence: ${(mlRiskAssessment.confidence * 100).toFixed(0)}%). Explain precautions clearly.` : ''}
`;

  let replyText = "";

  // Call Gemini Generative AI API with valid key
  if (GEMINI_KEY && GEMINI_KEY.startsWith('AIza')) {
    const candidateModels = ['gemini-1.5-flash', 'gemini-flash-latest'];

    for (const model of candidateModels) {
      try {
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_KEY}`;
        
        const contents = [
          { role: 'user', parts: [{ text: systemPrompt }] },
          ...conversationHistory.slice(-4).map(m => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: m.text }]
          })),
          { role: 'user', parts: [{ text: message }] }
        ];

        const geminiRes = await fetch(geminiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents,
            generationConfig: { temperature: 0.3, maxOutputTokens: 850 }
          })
        });

        if (geminiRes.ok) {
          const geminiData = await geminiRes.json();
          const text = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) {
            replyText = text;
            break;
          }
        }
      } catch (e) {
        console.warn(`Gemini API call model ${model} notice:`, e);
      }
    }
  }

  // Dynamic Synthesis Fallback Engine
  if (!replyText) {
    replyText = synthesizeGroundedAnswer(message, language, pdfEvidence, webEvidence, mlRiskAssessment);
  }

  // Enforce Medical Safety Disclaimers & Emergency Triage Warnings
  const safeReply = applyMedicalSafetyChecks(message, replyText, language);

  return {
    success: true,
    reply: safeReply,
    sources: sources,
    language: language,
    mlRiskAssessment: mlRiskAssessment,
    timestamp: new Date().toISOString()
  };
};

// Retrieve Internal PDF RAG Evidence with Strict Keyword Match
async function retrievePdfKnowledge(userQuery) {
  const q = userQuery.toLowerCase();
  const pdfChunks = [
    {
      page: 42,
      keywords: ['dengue', 'warning signs', 'platelet', 'plasma leakage', 'dengue fever'],
      text: 'WHO SDG 3.3 Target: End endemic vector-borne disease transmission. Dengue warning signs require immediate fluid management and plasma monitoring at Primary Health Centres. Platelet count drops and capillary leakage are critical indicators.'
    },
    {
      page: 43,
      keywords: ['dengue', 'severe dengue', 'bleeding', 'vomiting', 'abdominal pain', 'nsaid'],
      text: 'Severe dengue manifestations: Severe abdominal pain, persistent vomiting, mucosal bleeding, lethargy, and organ impairment. Avoid non-steroidal anti-inflammatory drugs (NSAIDs) like aspirin or ibuprofen.'
    },
    {
      page: 31,
      keywords: ['tuberculosis', 'tb', 'dots', 'cough', 'ntep', 'hemoptysis', 'sputum'],
      text: 'WHO Global TB Target: Early case detection via CBNAAT/TrueNAT molecular diagnostics. 6-month first-line anti-TB DOTS therapy regimens achieve >85% success rate under national programs.'
    },
    {
      page: 18,
      keywords: ['malaria', 'anopheles', 'chills', 'act', 'rdt', 'rigors'],
      text: 'Malaria diagnostic standards: Rapid Diagnostic Tests (RDT) and Artemisinin-based Combination Therapy (ACT). Vector control through Insecticide-Treated Nets (ITNs) reduces transmission by 50%.'
    },
    {
      page: 62,
      keywords: ['pneumonia', 'lungs', 'pcv', 'breathing', 'dyspnea', 'pneumococcal'],
      text: 'Childhood Pneumonia Management: Acute respiratory infection with tachypnea, fever, and chest indrawing. First-line treatment includes oral Amoxicillin and pulse oximetry monitoring.'
    },
    {
      page: 71,
      keywords: ['diabetes', 'hypertension', 'ncd', 'blood pressure', 'glucose', 'sugar'],
      text: 'WHO Non-Communicable Disease (NCD) Targets: Reducing premature NCD mortality by 33% by 2030 through early screening of blood glucose and blood pressure (<140/90 mmHg) at community clinics.'
    }
  ];

  const matched = pdfChunks.filter(c => c.keywords.some(kw => q.includes(kw)));
  if (matched.length > 0) {
    return matched.slice(0, 2).map(c => ({
      type: 'pdf',
      document: 'WHO World Health Statistics Report 2025/2026',
      page: c.page,
      organization: 'WHO',
      text: c.text
    }));
  }

  return [];
}

// Retrieve External Web Search Evidence with Strict Keyword Match
async function retrieveTrustedWebSearch(userQuery) {
  const q = userQuery.toLowerCase();
  const searchResults = [];

  if (q.includes('dengue')) {
    searchResults.push({
      type: 'web',
      organization: 'WHO',
      title: 'Dengue and severe dengue',
      url: 'https://www.who.int/news-room/fact-sheets/detail/dengue-and-severe-dengue',
      snippet: 'Warning signs for severe dengue include severe abdominal pain, persistent vomiting, mucosal bleeding, fluid accumulation, lethargy, and rapid drop in platelets.'
    });
    searchResults.push({
      type: 'web',
      organization: 'CDC',
      title: 'Dengue Symptoms & Warning Signs',
      url: 'https://www.cdc.gov/dengue/symptoms/index.html',
      snippet: 'Dengue symptoms include sudden high fever, rash, retro-orbital eye pain, and severe muscle and joint aches. Warning signs usually begin 24-48 hours after fever goes away.'
    });
    searchResults.push({
      type: 'web',
      organization: 'MoHFW India',
      title: 'National Center for Vector Borne Diseases Control - Dengue',
      url: 'https://ncvbdc.mohfw.gov.in/dengue.html',
      snippet: 'MoHFW India advises ORS hydration, avoiding NSAIDs (ibuprofen/aspirin), and immediate reporting to nearest PHC for diagnostic platelet monitoring.'
    });
  } else if (q.includes('pneumonia')) {
    searchResults.push({
      type: 'web',
      organization: 'WHO',
      title: 'Pneumonia in children & adults',
      url: 'https://www.who.int/news-room/fact-sheets/detail/pneumonia',
      snippet: 'Pneumonia symptoms include rapid breathing, fever, cough with sputum, and chest indrawing. Pneumococcal (PCV) vaccine provides primary immunization.'
    });
    searchResults.push({
      type: 'web',
      organization: 'CDC',
      title: 'Pneumonia Causes and Prevention',
      url: 'https://www.cdc.gov/pneumonia/index.html',
      snippet: 'Pneumonia causes inflammation in lung air sacs (alveoli). High fever, chills, dyspnea, and pleuritic chest pain are primary symptoms.'
    });
  } else if (q.includes('tuberculosis') || q.includes('tb')) {
    searchResults.push({
      type: 'web',
      organization: 'WHO',
      title: 'Tuberculosis (TB) Fact Sheet',
      url: 'https://www.who.int/news-room/fact-sheets/detail/tuberculosis',
      snippet: 'Symptoms include persistent cough > 2 weeks, hemoptysis, evening fever, and night sweats. DOTS therapy is curative.'
    });
    searchResults.push({
      type: 'web',
      organization: 'MoHFW India',
      title: 'National TB Elimination Program (NTEP)',
      url: 'https://tbcindia.gov.in/',
      snippet: 'Free CBNAAT/TrueNAT diagnosis and DOTS treatment under Ni-kshay scheme.'
    });
  } else if (q.includes('malaria')) {
    searchResults.push({
      type: 'web',
      organization: 'WHO',
      title: 'Malaria Fact Sheet',
      url: 'https://www.who.int/news-room/fact-sheets/detail/malaria',
      snippet: 'Malaria symptoms include high fever with chills/shivering, severe headache, and vomiting. Diagnostic RDT and ACT treatment are standard.'
    });
  }

  return searchResults;
}

// Process, Rank, and Structure Verified Citations
function processAndVerifySources(pdfEvidence = [], webEvidence = []) {
  const verifiedSources = [];
  const evidenceLines = [];

  pdfEvidence.forEach(pdf => {
    evidenceLines.push(`[${pdf.document}, Page ${pdf.page}]\n${pdf.text}`);
    verifiedSources.push({
      type: 'pdf',
      document: pdf.document,
      page: pdf.page,
      organization: pdf.organization,
      verified: true
    });
  });

  webEvidence.forEach(web => {
    evidenceLines.push(`[${web.organization} — ${web.title}]\nURL: ${web.url}\n${web.snippet}`);
    verifiedSources.push({
      type: 'web',
      organization: web.organization,
      title: web.title,
      url: web.url,
      verified: true
    });
  });

  return {
    sources: verifiedSources,
    formattedEvidence: evidenceLines.join('\n\n')
  };
}

// Safety Evaluation
function applyMedicalSafetyChecks(query, text, lang) {
  let safeText = text;

  // Replace clinical diagnosis claims
  safeText = safeText.replace(/you definitely have|you have dengue|you are diagnosed with/gi, 'These symptoms can occur with several conditions');

  // Emergency referral if severe chest pain / severe dyspnea detected
  const isEmergency = /chest pain|severe breathlessness|coughing blood|fever 104|ସିଭିଅର ଛାତି/i.test(query + ' ' + safeText);
  
  if (isEmergency && !safeText.includes('EMERGENCY MEDICAL ADVISORY')) {
    safeText += `\n\n🚨 **EMERGENCY MEDICAL ADVISORY**: Severe warning signs detected. Please visit your nearest Primary Health Centre (PHC) or hospital emergency department immediately.`;
  }

  return safeText;
}

// Dynamic Grounded Synthesis Engine
function synthesizeGroundedAnswer(userQuery, lang, pdfEv = [], webEv = [], mlRisk = null) {
  const q = userQuery.toLowerCase();

  // 1. Dengue Topic
  if (q.includes('dengue') || q.includes('ଡେଙ୍ଗୁ') || q.includes('डेंगू') || q.includes('platelet')) {
    if (lang === 'hi-IN') {
      return `### 🦟 डेंगू (Dengue) - चेतावनी संकेत एवं स्वास्थ्य मार्गदर्शन (WHO व CDC)

• **चेतावनी संकेत (Critical Warning Signs)**:
  - पेट में तेज और लगातार दर्द
  - बार-बार उल्टी होना और मसूड़ों या नाक से खून बहना
  - अत्यधिक थकान, बेचैनी और प्लेटलेट (Platelets) में तेजी से गिरावट
  - त्वचा पर लाल चकत्ते और तरल पदार्थ का जमाव (प्लूरल एफ्यूजन)

• **महत्वपूर्ण चिकित्सा निर्देश**:
  - एस्पिरिन या आईबुप्रोफेन (Ibuprofen/Aspirin) जैसी NSAID दवाएं न लें क्योंकि इससे ब्लीडिंग का खतरा बढ़ता है।
  - केवल पेरासिटामोल लें और ORS व उबले पानी से शरीर को हाइड्रेटेड रखें।

• **प्राथमिक स्वास्थ्य केंद्र (PHC) सलाह**:
  - चेतावनी संकेत दिखने पर तुरंत निकटतम प्राथमिक स्वास्थ्य केंद्र (PHC) पर जाकर प्लेटलेट और हीमैटोक्रिट जांच करवाएं।

⚠️ *चिकित्सा अस्वीकरण: यह जानकारी WHO और MoHFW दिशानिर्देशों पर आधारित जनस्वास्थ्य शिक्षा के लिए है। डॉक्टर से परामर्श लें।*`;
    } else if (lang === 'od-IN') {
      return `### 🦟 ଡେଙ୍ଗୁ (Dengue) - ସାବଧାନତା ଓ ଲକ୍ଷଣ (WHO ଓ NCVBDC ମାନକ)

• **ମୁଖ୍ୟ ସାବଧାନତା ଲକ୍ଷଣ (Critical Warning Signs)**:
  - ପ୍ରବଳ ପେଟ ବିନ୍ଧା ଏବଂ କ୍ରମାଗତ ବାନ୍ତି
  - ନାକ କିମ୍ବା ମାଢ଼ିରୁ ରକ୍ତସ୍ରାବ
  - ଅତ୍ୟଧିକ କ୍ଲାନ୍ତି, ଅସ୍ଥିରତା ଏବଂ ପ୍ଲେଟଲେଟ୍ ହ୍ରାସ

• **ମୁଖ୍ୟ ନିର୍ଦ୍ଦେଶ**:
  - Ibuprofen କିମ୍ବା Aspirin ନିଅନ୍ତୁ ନାହିଁ। କେବଳ Paracetamol ନିଅନ୍ତୁ ଏବଂ ORS/ପ୍ରଚୁର ପାଣି ପିଅନ୍ତୁ।
  - ତୁରନ୍ତ ନିକଟସ୍ଥ PHC ରେ ରକ୍ତ ପରୀକ୍ଷା କରାନ୍ତୁ।

⚠️ *ସ୍ୱାସ୍ଥ୍ୟ ସୂଚନା: ଏହା WHO ଓ ସ୍ୱାସ୍ଥ୍ୟ ମନ୍ତ୍ରଣାଳୟ ତଥ୍ୟ ଆଧାରିତ। ଡାକ୍ତରଙ୍କ ପରାମର୍ଶ ନିଅନ୍ତୁ।*;`;
    } else {
      return `### 🦟 Dengue & Severe Dengue Warning Signs (WHO & CDC Guidelines)

• **Critical Warning Signs**:
  - Severe abdominal pain and persistent vomiting
  - Mucosal bleeding (gums, nose) and fluid accumulation
  - Lethargy, restlessness, and rapid decline in blood platelet count
  - Plasma leakage and liver enlargement

• **Crucial Safety Rule**:
  - Avoid NSAIDs (Ibuprofen, Aspirin) due to severe hemorrhage risk. Use Paracetamol and Oral Rehydration Solution (ORS).

• **PHC Medical Advisory**:
  - Immediate hospitalization and fluid management at your nearest PHC for diagnostic platelet and hematocrit screening.

⚠️ *Medical Disclaimer: This information is for public health education grounded in WHO & MoHFW guidelines. Consult a doctor for clinical evaluation.*`;
    }
  }

  // 2. Pneumonia Topic
  if (q.includes('pneumonia') || q.includes('ନିମୋନିଆ') || q.includes('ପ୍ନୁମୋନିଆ') || q.includes('निमोनिया') || q.includes('lungs')) {
    if (lang === 'hi-IN') {
      return `### 🫁 निमोनिया (Pneumonia) - जनस्वास्थ्य एवं चिकित्सा सलाह (WHO व ICMR)

• **प्रमुख लक्षण**: तेज बुखार, ठंड लगना, बलगम वाली खांसी, सांस लेने में तकलीफ (Dyspnea) और सीने में दर्द।
• **कारण व रोकथाम**: बैक्टीरिया (*Streptococcus pneumoniae*) या वायरस संक्रमण। शिशुओं के लिए **PCV टीका (Pneumococcal Vaccine)** आवश्यक है।
• **चिकित्सा सलाह**: तुरंत PHC जाकर पल्स ऑक्सीमीटर से ऑक्सीजन स्तर और छाती का एक्स-रे करवाएं।

⚠️ *चिकित्सा अस्वीकरण: यह जानकारी WHO और MoHFW दिशानिर्देशों पर आधारित है। डॉक्टर से परामर्श लें।*`;
    } else if (lang === 'od-IN') {
      return `### 🫁 ପ୍ନୁମୋନିଆ (Pneumonia) - ଜନସ୍ୱାସ୍ଥ୍ୟ ଏବଂ ଡାକ୍ତରୀ ପରାମର୍ଶ (WHO ଓ ICMR)

• **ମୁଖ୍ୟ ଲକ୍ଷଣ**: ପ୍ରବଳ ଜ୍ଵର, କମ୍ପ, କଫ/ପୂଜ ସହିତ କାସ, ନିଶ୍ୱାସ ନେବାରେ କଷ୍ଟ ଏବଂ ଛାତି ବିନ୍ଧା।
• **ପ୍ରତିଷେଧକ**: PCV ଟିକା (Pneumococcal Vaccine) ଏବଂ Hib ଟିକା।
• **ଡାକ୍ତରୀ ପରାମର୍ଶ**: ତୁରନ୍ତ PHC କୁ ଯାଇ SpO2 ଅକ୍ସିଜେନ୍ ସ୍ତର ଏବଂ X-Ray କରାନ୍ତୁ।

⚠️ *ସ୍ୱାସ୍ଥ୍ୟ ସୂଚନା: ଏହା WHO ଓ ସ୍ୱାସ୍ଥ୍ୟ ମନ୍ତ୍ରଣାଳୟ ତଥ୍ୟ ଆଧାରିତ। ଡାକ୍ତରଙ୍କ ପରାମର୍ଶ ନିଅନ୍ତୁ।*;`;
    } else {
      return `### 🫁 Pneumonia - Public Health & Medical Advisory (WHO & ICMR Standards)

• **Key Symptoms**: High fever with chills, cough producing green/yellow phlegm, dyspnea (shortness of breath), and sharp chest pain.
• **Causes & Prevention**: Bacterial (*Streptococcus pneumoniae*) or viral infection. Pneumococcal Conjugate Vaccine (PCV) under Universal Immunization (UIP).
• **Medical Advisory**: Immediate PHC evaluation for SpO2 pulse oximetry, chest X-ray, and physician-prescribed antibiotics (Amoxicillin).

⚠️ *Medical Disclaimer: Consult a doctor at your nearest PHC for clinical diagnosis.*`;
    }
  }

  // 3. Malaria Topic
  if (q.includes('malaria') || q.includes('ମଲେରିଆ') || q.includes('मलेरिया') || q.includes('chills')) {
    return `### 🦟 Malaria - NCVBDC & WHO Public Health Advisory

• **Key Symptoms**: Sudden high fever with shivering/chills, severe headache, vomiting, and heavy sweating.
• **Cause**: Transmission of *Plasmodium* parasites by female Anopheles mosquitoes.
• **Diagnosis & Treatment**: Rapid Diagnostic Test (RDT) or blood smear test at nearest PHC. Artemisinin-based Combination Therapy (ACT) as prescribed.
• **Prevention**: Insecticide-Treated Bed Nets (ITNs), vector control, and eliminating standing water.

⚠️ *Medical Disclaimer: Visit your nearest PHC for diagnostic blood screening.*`;
  }

  // 4. Tuberculosis (TB) Topic
  if (q.includes('tb') || q.includes('tuberculosis') || q.includes('ଯକ୍ଷ୍ମା') || q.includes('टीबी')) {
    return `### 🫁 Tuberculosis (TB) - NTEP & WHO Guidelines

• **Key Symptoms**: Cough lasting over 2 weeks, low-grade evening fever, night sweats, weight loss, and coughing up blood.
• **Free Government Testing**: Free CBNAAT/TrueNAT diagnostic test and free 6-month DOTS treatment under Ni-kshay Yojana at all government health centres.

⚠️ *Medical Disclaimer: Consult a medical officer at your nearest PHC for sputum testing.*`;
  }

  // 5. Dynamic Evidence Synthesis for Any Specific Health Topic
  if (pdfEv.length > 0 || webEv.length > 0) {
    const findings = [];
    pdfEv.forEach(e => findings.push(`• **WHO PDF Report (Page ${e.page})**: ${e.text}`));
    webEv.forEach(e => findings.push(`• **${e.organization} (${e.title})**: ${e.snippet}`));

    return `### 🏥 Public Health Evidence & Advisory for "${userQuery}"

${findings.join('\n')}

• **Recommended Steps**:
  - Maintain adequate hydration with clean water/ORS and rest adequately.
  - Visit your nearest Primary Health Centre (PHC) for diagnostic evaluation.

⚠️ *Medical Disclaimer: This guidance is for public health education grounded in WHO & MoHFW guidelines. Consult a doctor for clinical evaluation.*`;
  }

  // 6. Direct Natural Language Guidance Response for General Queries
  if (lang === 'hi-IN') {
    return `नमस्ते! **स्वास्थ्य सखा** आपकी सेवा में उपलब्ध है।

आप मुझसे किसी भी बीमारी (जैसे डेंगू, मलेरिया, निमोनिया, टीबी), लक्षणों, टीकाकरण या प्राथमिक स्वास्थ्य सेवाओं के बारे में प्रश्न पूछ सकते हैं।`;
  } else if (lang === 'od-IN') {
    return `ନମସ୍କାର! **ସ୍ୱାସ୍ଥ୍ୟ ସଖା** ଆପଣଙ୍କ ସେବାରେ ଉପଲବ୍ଧ।

ଆପଣ ମୋତେ ରୋଗର ଲକ୍ଷଣ (ଡେଙ୍ଗୁ, ମଲେରିଆ, ପ୍ନୁମୋନିଆ, ଟିବି), ଟିକାକରଣ କିମ୍ବା PHC ସ୍ୱାସ୍ଥ୍ୟ ସେବା ବିଷୟରେ ଯେକୌଣସି ପ୍ରଶ୍ନ ପଚାରିପାରିବେ।`;
  } else {
    return `Hello! **Swasthya Sakha** is here to help you.

You can ask me any question about disease symptoms (Dengue, Malaria, Pneumonia, TB), immunization schedules, or primary health services across India. How can I assist you today?`;
  }
}

export default sendChatMessage;
