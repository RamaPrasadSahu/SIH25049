const axios = require('axios');
const pdfRagService = require('./pdfRag.service');
const webSearchService = require('./webSearch.service');
const sourceVerifierService = require('./sourceVerifier.service');
const medicalSafetyService = require('./medicalSafety.service');

class LLMService {
  /**
   * Retrieves Sarvam AI, OpenAI, or Gemini keys
   */
  getApiKey() {
    const sarvamKey = process.env.SARVAM_API_KEY || process.env.VITE_SARVAM_API_KEY || 'sk_gzol1gpk_pa1c7V1dPHN2SIo3h0wXmwJx';
    if (sarvamKey) {
      return { provider: 'sarvam', key: sarvamKey.trim() };
    }

    const openAiKey = process.env.OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY;
    if (openAiKey && openAiKey.startsWith('sk-')) {
      return { provider: 'openai', key: openAiKey.trim() };
    }

    const geminiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
    if (geminiKey && geminiKey.startsWith('AIza')) {
      return { provider: 'gemini', key: geminiKey.trim() };
    }

    return { provider: null, key: '' };
  }

  /**
   * Generates natural conversational response grounded in Hybrid PDF RAG + External Medical Search
   */
  async generateResponse(userMessage, conversationHistory = [], userLanguage = 'od-IN', mlRiskAssessment = null) {
    // 1. Parallel Evidence Search (Internal PDF RAG + External Trusted Search)
    const [pdfResults, webResults] = await Promise.all([
      pdfRagService.searchPdfKnowledge(userMessage),
      webSearchService.searchTrustedWeb(userMessage)
    ]);

    // 2. Source Verification & Evidence Ranking
    const { evidence, sources } = sourceVerifierService.processEvidence(pdfResults, webResults);

    // Format Evidence Text for System Prompt
    const pdfEvidenceText = evidence
      .filter(e => e.type === 'pdf')
      .map(e => `[${e.document}, Page ${e.page}]\n${e.text}`)
      .join('\n\n');

    const webEvidenceText = evidence
      .filter(e => e.type === 'web')
      .map(e => `[${e.organization} — ${e.title}]\nURL: ${e.url}\n${e.snippet}`)
      .join('\n\n');

    const { provider, key: apiKey } = this.getApiKey();

    const systemPrompt = `
# SWASTHYA SAKHA — MEDICAL AI AGENT SYSTEM PROMPT

You are **Swasthya Sakha**, a safety-focused medical information AI assistant for citizens of Odisha and India (User Language: ${userLanguage}).

Your goal is NOT to simply generate an answer from your internal knowledge. For every medical question, follow this structured process:

1. UNDERSTAND THE USER'S QUESTION
- Determine actual medical question, symptoms, disease, treatment, or medicine concern.
- Identify missing information that could change the recommendation. Ask clarifying questions if vague.

2. SEARCH TRUSTED EXTERNAL SOURCES (WHO, MoHFW, CDC, NIH, FDA, NHS, ICMR)
- Prioritize Tier 1 public health organizations. Do NOT use random blogs, unverified sites, or forums.

3. SEARCH THE PROVIDED KNOWLEDGE BASE
- Ground answers in retrieved Swasthya Sakha datasets/PDFs. Never blindly trust retrieved text.

4. CROSS-VERIFY INFORMATION
- Classify internally as CONFIRMED, SUPPORTED, UNCERTAIN, or UNSAFE TO CLAIM.
- Never manufacture medical facts or fake citations.

5. PATIENT CONTEXT & TRIAGE
- Low Risk: General health info.
- Moderate Risk: Symptoms needing evaluation.
- High Risk / Emergency: Severe breathlessness, chest pain, loss of consciousness, seizure, severe bleeding, or stroke signs. Prioritize emergency advice immediately.

6. MEDICINE & DIAGNOSIS SAFETY
- Never claim "You definitely have X." Use "This can be associated with..." or "Possible causes include...".
- Never invent drug dosages. Do not casually recommend prescription medicines.

7. RESPONSE STRUCTURE (Use when appropriate):
### Understanding
### Evidence-based information
### What you should do
### Important warning
### When to see a doctor
### Sources

8. LANGUAGE
- Respond natively in the same script/language requested by the user (Odia, Hindi, Hinglish, English, Bengali, Marathi, Tamil, Telugu, Gujarati).

RETRIEVED REFERENCE MATERIAL:
INTERNAL PDF EVIDENCE:
${pdfEvidenceText || 'No specific PDF matches.'}

EXTERNAL TRUSTED MEDICAL EVIDENCE:
${webEvidenceText || 'No specific web search matches.'}

${mlRiskAssessment ? `ML RISK SCREENING CONTEXT: High-risk indicators detected: ${mlRiskAssessment.prediction} (Confidence: ${(mlRiskAssessment.confidence * 100).toFixed(0)}%). Explain precautions clearly.` : ''}
`;

    let replyText = "";

    // 1. Primary AI Brain: Sarvam AI 105B (State-of-the-Art Indian LLM)
    if (provider === 'sarvam') {
      try {
        console.log(`[LLMService] Calling Sarvam 105B AI Brain...`);
        const response = await axios.post(
          'https://api.sarvam.ai/v1/chat/completions',
          {
            model: 'sarvam-105b',
            messages: [
              { role: 'system', content: systemPrompt },
              ...conversationHistory.map(m => ({
                role: m.role === 'assistant' ? 'assistant' : 'user',
                content: m.text
              })),
              { role: 'user', content: userMessage }
            ],
            temperature: 0.4,
            max_tokens: 1024
          },
          {
            headers: {
              'api-subscription-key': apiKey,
              'Content-Type': 'application/json'
            },
            timeout: 15000
          }
        );

        const text = response.data?.choices?.[0]?.message?.content;
        if (text) {
          replyText = text;
          console.log(`[LLMService] SUCCESS: Response generated via Sarvam 105B AI Brain!`);
        }
      } catch (error) {
        console.error(`[LLMService] Sarvam 105B call notice:`, error.response?.data || error.message);
      }
    }

    // 2. Secondary AI Brain Failovers (OpenAI / Gemini)
    if (!replyText && process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.startsWith('sk-')) {
      try {
        const response = await axios.post(
          'https://api.openai.com/v1/chat/completions',
          {
            model: 'gpt-4o-mini',
            messages: [
              { role: 'system', content: systemPrompt },
              ...conversationHistory.map(m => ({
                role: m.role === 'assistant' ? 'assistant' : 'user',
                content: m.text
              })),
              { role: 'user', content: userMessage }
            ],
            temperature: 0.4
          },
          {
            headers: {
              'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
              'Content-Type': 'application/json'
            },
            timeout: 15000
          }
        );
        replyText = response.data?.choices?.[0]?.message?.content || "";
      } catch (err) {}
    }

    if (!replyText) {
      replyText = this.generateEvidenceFallbackResponse(userMessage, evidence, mlRiskAssessment);
    }

    // 3. Medical Safety & Emergency Triage Evaluation
    const finalVerifiedReply = medicalSafetyService.evaluateMedicalSafety(userMessage, replyText);

    return {
      reply: finalVerifiedReply,
      sources: sources
    };
  }

  /**
   * Evidence-grounded fallback response generator
   */
  generateEvidenceFallbackResponse(userMessage, evidence, mlRiskAssessment) {
    const q = userMessage.toLowerCase().trim();
    const wordCount = q.split(/\s+/).length;

    // Vague Query
    if (wordCount <= 4 && !q.includes('what') && !q.includes('how') && !q.includes('symptoms')) {
      return `### Understanding\nI understand you are asking about "${userMessage}".\n\n### What you should do\nCould you share a bit more detail (such as specific symptoms, duration, or age) so I can provide relevant guidance?\n\n### When to see a doctor\nIf symptoms are severe or worsening, please visit your nearest Primary Health Centre (PHC).`;
    }

    if (evidence.length > 0) {
      const topEvidence = evidence[0];
      return `### Understanding\nRegarding your health question about **"${userMessage}"**:\n\n### Evidence-based information\n${topEvidence.text || topEvidence.snippet}\n\n### What you should do\nMaintain good hydration with clean water or ORS and rest.\n\n### When to see a doctor\nPlease consult a physician at your nearest Primary Health Centre (PHC) for clinical diagnosis.\n\n### Sources\n- ${topEvidence.organization || topEvidence.document} (Verified Medical Reference)`;
    }

    return `### Understanding\nRegarding **"${userMessage}"**:\n\n### Evidence-based information\nIf you are experiencing symptoms, maintain proper fluid intake with clean water or ORS and rest.\n\n### When to see a doctor\nPlease visit your nearest Primary Health Centre (PHC) for diagnostic evaluation.`;
  }
}

module.exports = new LLMService();
