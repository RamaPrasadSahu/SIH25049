/**
 * Swasthya Sakha - Multi-lingual Language Detection & Utility Service
 * Auto-detects input language and script to guarantee exact language response matching.
 */

const SCRIPT_RANGES = [
  { name: 'Odia', code: 'od-IN', regex: /[\u0B00-\u0B7F]/ },
  { name: 'Devanagari', code: 'hi-IN', regex: /[\u0900-\u097F]/ },
  { name: 'Bengali', code: 'bn-IN', regex: /[\u0980-\u09FF]/ },
  { name: 'Tamil', code: 'ta-IN', regex: /[\u0B80-\u0BFF]/ },
  { name: 'Telugu', code: 'te-IN', regex: /[\u0C00-\u0C7F]/ },
  { name: 'Gujarati', code: 'gu-IN', regex: /[\u0A80-\u0AFF]/ },
  { name: 'Gurmukhi', code: 'pa-IN', regex: /[\u0A00-\u0A7F]/ },
  { name: 'Malayalam', code: 'ml-IN', regex: /[\u0D00-\u0D7F]/ },
  { name: 'Kannada', code: 'kn-IN', regex: /[\u0C80-\u0CFF]/ },
  { name: 'Arabic', code: 'ar', regex: /[\u0600-\u06FF]/ }
];

const LATIN_PATTERNS = [
  {
    code: 'es',
    name: 'Spanish',
    regex: /\b(hola|tengo|fiebre|dolor|cabeza|gracias|buenos|días|doctor|doctores|enfermo|enferma|síntomas|medicina|salud|ayuda)\b/i
  },
  {
    code: 'fr',
    name: 'French',
    regex: /\b(bonjour|salut|j'ai|fièvre|douleur|tête|merci|médecin|docteur|malade|symptômes|santé|aide|pourquoi)\b/i
  },
  {
    code: 'de',
    name: 'German',
    regex: /\b(hallo|ich|habe|fieber|kopfschmerzen|schmerzen|danke|arzt|krank|symptome|gesundheit|hilfe)\b/i
  },
  {
    code: 'hi-IN',
    name: 'Hinglish / Romanized Hindi',
    regex: /\b(bukhar|sir|sirdard|dard|hai|mujhe|mujhse|kaise|kya|hai|batao|upay|elaj|dawai|karo|bhai)\b/i
  },
  {
    code: 'od-IN',
    name: 'Romanized Odia',
    regex: /\b(mote|jwara|heuchi|kemiti|achanti|gharelu|upaya|tika|ausadha|swasthya|khana|pani)\b/i
  }
];

const LANG_DISPLAY_NAMES = {
  'od-IN': 'Odia (ଓଡ଼ିଆ)',
  'hi-IN': 'Hindi (हिन्दी)',
  'en-IN': 'English',
  'bn-IN': 'Bengali (বাংলা)',
  'ta-IN': 'Tamil (தமிழ்)',
  'te-IN': 'Telugu (తెలుగు)',
  'mr-IN': 'Marathi (मराठी)',
  'gu-IN': 'Gujarati (ગુજરાતી)',
  'pa-IN': 'Punjabi (ਪੰਜਾਬੀ)',
  'kn-IN': 'Kannada (ಕನ್ನಡ)',
  'ml-IN': 'Malayalam (മലയാളം)',
  'as-IN': 'Assamese (অসমীয়া)',
  'es': 'Spanish (Español)',
  'fr': 'French (Français)',
  'de': 'German (Deutsch)',
  'ar': 'Arabic (العربية)'
};

/**
 * Auto-detects text language code based on unicode script and keyword frequency
 */
function detectLanguageFromText(text, fallbackLang = 'en-IN') {
  if (!text || typeof text !== 'string' || !text.trim()) {
    return fallbackLang;
  }

  const str = text.trim();

  // 1. Script Range Matching (Highest Priority for native scripts)
  for (const script of SCRIPT_RANGES) {
    if (script.regex.test(str)) {
      // Special distinction between Marathi & Hindi Devanagari if specific words present
      if (script.code === 'hi-IN') {
        if (/\b(मला|ताप|आहे|का|काय|औषध|आरोग्य|डोकेदुखी)\b/i.test(str)) {
          return 'mr-IN';
        }
      }
      // Special distinction between Assamese & Bengali if specific words present
      if (script.code === 'bn-IN') {
        if (/\b(মই|পানী|জ্বৰ|কাহ|নমস্কাৰ|কেনে|আছোঁ)\b/i.test(str)) {
          return 'as-IN';
        }
      }
      return script.code;
    }
  }

  // 2. Latin-script Keyword Regex Matching
  for (const lat of LATIN_PATTERNS) {
    if (lat.regex.test(str)) {
      return lat.code;
    }
  }

  // If input contains common English words or general text, return fallbackLang if provided, else 'en-IN'
  return fallbackLang || 'en-IN';
}

function getLanguageName(code) {
  return LANG_DISPLAY_NAMES[code] || LANG_DISPLAY_NAMES['en-IN'];
}

/**
 * Returns localized Markdown headers & structure for fallback LLM responses
 */
function getLocalizedResponseTemplates(langCode) {
  switch (langCode) {
    case 'hi-IN':
    case 'mr-IN':
      return {
        understandingHeader: '### समझ (Understanding)',
        evidenceHeader: '### साक्ष्य-आधारित जानकारी (Evidence-based information)',
        whatToDoHeader: '### आपको क्या करना चाहिए (What you should do)',
        warningHeader: '### महत्वपूर्ण चेतावनी (Important warning)',
        doctorHeader: '### डॉक्टर से परामर्श कब लें (When to see a doctor)',
        sourcesHeader: '### स्रोत (Sources)',
        vaguePromptText: 'कृपया अपने लक्षणों, उनकी अवधि या उम्र के बारे में थोड़ा और विवरण साझा करें ताकि मैं आपको सही जानकारी दे सकूं।',
        phcAdvice: 'यदि लक्षण गंभीर या बिगड़ रहे हैं, तो कृपया अपने निकटतम प्राथमिक स्वास्थ्य केंद्र (PHC) पर जाएं।'
      };
    case 'od-IN':
      return {
        understandingHeader: '### ବୁଝାମଣା (Understanding)',
        evidenceHeader: '### ପ୍ରମାଣ-ଆଧାରିତ ସୂଚନା (Evidence-based information)',
        whatToDoHeader: '### ଆପଣ କ’ଣ କରିବା ଉଚିତ୍ (What you should do)',
        warningHeader: '### ଗୁରୁତ୍ୱପୂର୍ଣ୍ଣ ସଚେତନତା (Important warning)',
        doctorHeader: '### ଡାକ୍ତରଙ୍କ ପରାମର୍ଶ କେବେ ନେବେ (When to see a doctor)',
        sourcesHeader: '### ଉତ୍ସ (Sources)',
        vaguePromptText: 'ଦୟାକରି ଆପଣଙ୍କ ଲକ୍ଷଣ, ସମୟସୀମା କିମ୍ବା ବୟସ ବିଷୟରେ ଅଧିକ ସୂଚନା ଦିଅନ୍ତୁ ଯାହାଦ୍ୱାରା ମୁଁ ସଠିକ୍ ପରାମର୍ଶ ଦେଇପାରିବି।',
        phcAdvice: 'ଯଦି ଲକ୍ଷଣ ଅଧିକ ହେଉଥାଏ, ଦୟାକରି ନିକଟସ୍ଥ ପ୍ରାଥମିକ ସ୍ୱାସ୍ଥ୍ୟ କେନ୍ଦ୍ର (PHC) କୁ ଯାଆନ୍ତୁ।'
      };
    case 'bn-IN':
    case 'as-IN':
      return {
        understandingHeader: '### বোধগম্যতা (Understanding)',
        evidenceHeader: '### তথ্য-ভিত্তিক তথ্য (Evidence-based information)',
        whatToDoHeader: '### আপনার কী করা উচিত (What you should do)',
        warningHeader: '### গুরুত্বপূর্ণ সতর্কবার্তা (Important warning)',
        doctorHeader: '### কখন ডাক্তারের সাথে পরামর্শ করবেন (When to see a doctor)',
        sourcesHeader: '### উৎস (Sources)',
        vaguePromptText: 'সঠিক নির্দেশনার জন্য অনুগ্রহ করে আপনার লক্ষণ, সময়কাল বা বয়স সম্পর্কে বিস্তারিত জান জানান।',
        phcAdvice: 'লক্ষণগুলি গুরুতর হলে অবিলম্বে আপনার নিকটস্থ প্রাথমিক স্বাস্থ্য কেন্দ্রে (PHC) যোগাযোগ করুন।'
      };
    case 'ta-IN':
      return {
        understandingHeader: '### புரிதல் (Understanding)',
        evidenceHeader: '### சான்று சார்ந்த தகவல் (Evidence-based information)',
        whatToDoHeader: '### நீங்கள் என்ன செய்ய வேண்டும் (What you should do)',
        warningHeader: '### முக்கியமான எச்சரிக்கை (Important warning)',
        doctorHeader: '### எப்போது மருத்துவரை அணுக வேண்டும் (When to see a doctor)',
        sourcesHeader: '### ஆதாரங்கள் (Sources)',
        vaguePromptText: 'தயவுசெய்து உங்கள் அறிகுறிகள் அல்லது காலம் பற்றிய கூடுதல் தகவல்களைப் பகிரவும்.',
        phcAdvice: 'அறிகுறிகள் தீவிரமடைந்தால், உடனடியாக அருகில் உள்ள ஆரம்ப சுகாதார நிலையத்திற்குச் செல்லவும்.'
      };
    case 'te-IN':
      return {
        understandingHeader: '### అవగాహన (Understanding)',
        evidenceHeader: '### ఆధారిత సమాచారం (Evidence-based information)',
        whatToDoHeader: '### మీరు ఏమి చేయాలి (What you should do)',
        warningHeader: '### ముఖ్యమైన హెచ్చరిక (Important warning)',
        doctorHeader: '### వైద్యుడిని ఎప్పుడు సంప్రదించాలి (When to see a doctor)',
        sourcesHeader: '### ఆధారాలు (Sources)',
        vaguePromptText: 'దయచేసి మీ లక్షణాలు లేదా సమయం గురించిన మరిన్ని వివరాలను పంచుకోండి.',
        phcAdvice: 'లక్షణాలు తీవ్రమైతే, వెంటనే దగ్గరలోని ప్రాథమిక ఆరోగ్య కేంద్రానికి వెళ్లండి.'
      };
    case 'es':
      return {
        understandingHeader: '### Comprensión (Understanding)',
        evidenceHeader: '### Información basada en evidencia (Evidence-based information)',
        whatToDoHeader: '### Lo que debe hacer (What you should do)',
        warningHeader: '### Advertencia importante (Important warning)',
        doctorHeader: '### Cuándo consultar a un médico (When to see a doctor)',
        sourcesHeader: '### Fuentes (Sources)',
        vaguePromptText: 'Por favor, comparta más detalles sobre sus síntomas o duración para brindarle una mejor orientación.',
        phcAdvice: 'Si los síntomas empeoran o son graves, acuda al centro de salud o médico más cercano.'
      };
    case 'fr':
      return {
        understandingHeader: '### Compréhension (Understanding)',
        evidenceHeader: '### Informations basées sur des preuves (Evidence-based information)',
        whatToDoHeader: '### Ce que vous devez faire (What you should do)',
        warningHeader: '### Avertissement important (Important warning)',
        doctorHeader: '### Quand consulter un médecin (When to see a doctor)',
        sourcesHeader: '### Sources (Sources)',
        vaguePromptText: 'Veuillez partager plus de détails sur vos symptômes pour obtenir des conseils précis.',
        phcAdvice: 'Si les symptômes s\'aggravent, consultez immédiatement un médecin ou le centre de santé le plus proche.'
      };
    default:
      return {
        understandingHeader: '### Understanding',
        evidenceHeader: '### Evidence-based information',
        whatToDoHeader: '### What you should do',
        warningHeader: '### Important warning',
        doctorHeader: '### When to see a doctor',
        sourcesHeader: '### Sources',
        vaguePromptText: 'Could you share a bit more detail (such as specific symptoms, duration, or age) so I can provide relevant guidance?',
        phcAdvice: 'If symptoms are severe or worsening, please visit your nearest Primary Health Centre (PHC).'
      };
  }
}

module.exports = {
  detectLanguageFromText,
  getLanguageName,
  getLocalizedResponseTemplates,
  LANG_DISPLAY_NAMES
};
