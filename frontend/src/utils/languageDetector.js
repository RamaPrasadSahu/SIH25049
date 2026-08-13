/**
 * Client-Side Language Detection Utility for Swasthya Sakha
 * Auto-detects input script & language to ensure dynamic UI & service alignment.
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
    regex: /\b(hola|tengo|fiebre|dolor|cabeza|gracias|buenos|días|doctor|doctores|enfermo|enferma|síntomas|medicina|salud|ayuda)\b/i
  },
  {
    code: 'fr',
    regex: /\b(bonjour|salut|j'ai|fièvre|douleur|tête|merci|médecin|docteur|malade|symptômes|santé|aide|pourquoi)\b/i
  },
  {
    code: 'de',
    regex: /\b(hallo|ich|habe|fieber|kopfschmerzen|schmerzen|danke|arzt|krank|symptome|gesundheit|hilfe)\b/i
  },
  {
    code: 'hi-IN',
    regex: /\b(bukhar|sir|sirdard|dard|hai|mujhe|mujhse|kaise|kya|hai|batao|upay|elaj|dawai|karo|bhai)\b/i
  },
  {
    code: 'od-IN',
    regex: /\b(mote|jwara|heuchi|kemiti|achanti|gharelu|upaya|tika|ausadha|swasthya|khana|pani)\b/i
  }
];

export function detectClientLanguage(text, defaultLang = 'od-IN') {
  if (!text || typeof text !== 'string' || !text.trim()) {
    return defaultLang;
  }

  const str = text.trim();

  // 1. Native Script Matching
  for (const script of SCRIPT_RANGES) {
    if (script.regex.test(str)) {
      if (script.code === 'hi-IN' && /\b(मला|ताप|आहे|का|काय|औषध|आरोग्य|डोकेदुखी)\b/i.test(str)) {
        return 'mr-IN';
      }
      if (script.code === 'bn-IN' && /\b(মই|পানী|জ্বৰ|কাহ|নমস্কাৰ|কেনে|আছোঁ)\b/i.test(str)) {
        return 'as-IN';
      }
      return script.code;
    }
  }

  // 2. Latin Pattern Matching
  for (const lat of LATIN_PATTERNS) {
    if (lat.regex.test(str)) {
      return lat.code;
    }
  }

  // If input contains standard English words or general text
  return defaultLang || 'en-IN';
}

export default detectClientLanguage;
