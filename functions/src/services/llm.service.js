const axios = require('axios');
const pdfRagService = require('./pdfRag.service');
const webSearchService = require('./webSearch.service');
const sourceVerifierService = require('./sourceVerifier.service');
const medicalSafetyService = require('./medicalSafety.service');

class LLMService {
  getApiKey() {
    return process.env.GEMINI_API_KEY || '';
  }

  /**
   * Generates natural conversational response grounded in Hybrid PDF RAG + External Medical Search
   */
  async generateResponse(userMessage, conversationHistory = [], userLanguage = 'en-IN', mlRiskAssessment = null) {
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

    const apiKey = this.getApiKey();

    const systemPrompt = `
You are Swasthya Sakha, a public health and medical information assistant designed for citizens across India under SIH Problem Statement 25049.

IMPORTANT COMPLIANCE & GROUNDING RULES:
1. Answer using ONLY the retrieved medical evidence provided below. Do not invent medical facts.
2. DO NOT provide definitive clinical diagnoses. Always use educational language: "These symptoms can occur with several conditions..."
3. DO NOT claim 100% accuracy or invent drug dosages.
4. Prefer authoritative sources (WHO, MoHFW India, CDC, ICMR). If evidence is insufficient, state clearly.
5. If sources disagree, explain the uncertainty objectively.
6. Provide citations based ONLY on the supplied evidence. Do NOT invent hallucinated source links.

INTERNAL PDF EVIDENCE:
${pdfEvidenceText || 'No specific PDF matches.'}

EXTERNAL TRUSTED MEDICAL EVIDENCE:
${webEvidenceText || 'No specific web search matches.'}

${mlRiskAssessment ? `ML RISK SCREENING CONTEXT: High-risk indicators detected: ${mlRiskAssessment.prediction} (Confidence: ${(mlRiskAssessment.confidence * 100).toFixed(0)}%). Explain precautions clearly.` : ''}
`;

    let replyText = "";

    if (apiKey && apiKey.startsWith('AIza')) {
      const candidateModels = ['gemini-1.5-flash', 'gemini-flash-latest'];

      for (const model of candidateModels) {
        try {
          const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
          
          const contents = [
            { role: 'user', parts: [{ text: systemPrompt }] },
            ...conversationHistory.map(m => ({
              role: m.role === 'assistant' ? 'model' : 'user',
              parts: [{ text: m.text }]
            })),
            { role: 'user', parts: [{ text: userMessage }] }
          ];

          const response = await axios.post(url, { contents }, { timeout: 12000 });
          const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

          if (text) {
            replyText = text;
            break;
          }
        } catch (error) {
          console.warn(`Gemini model ${model} call failed (${error.message}). Trying fallback.`);
        }
      }
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
   * Evidence-grounded fallback response generator when LLM API key is offline
   */
  generateEvidenceFallbackResponse(userMessage, evidence, mlRiskAssessment) {
    const q = userMessage.toLowerCase();
    
    if (evidence.length > 0) {
      const topEvidence = evidence[0];
      if (topEvidence.type === 'pdf') {
        return `Based on the internal medical knowledge base [${topEvidence.document}, Page ${topEvidence.page}]:\n• ${topEvidence.text}\n\n⚠️ *Medical Disclaimer: This information is for public health awareness. Consult a doctor for clinical diagnosis.*`;
      } else {
        return `According to verified public health guidance from ${topEvidence.organization} (${topEvidence.title}):\n• ${topEvidence.snippet}\n\n⚠️ *Medical Disclaimer: This guidance is for public health education. Please consult a physician at your nearest PHC.*`;
      }
    }

    return `Based on official WHO and ICMR public health guidelines:\n• If you are experiencing fever, body ache, or cough, stay hydrated with clean water/ORS and rest.\n• Visit your nearest Primary Health Centre (PHC) for diagnostic screening.\n\n⚠️ *Medical Disclaimer: Consult a doctor for clinical evaluation.*`;
  }
}

module.exports = new LLMService();
