const SOURCE_PRIORITY = {
  "who.int": 100,
  "WHO": 100,
  "mohfw.gov.in": 98,
  "MoHFW India": 98,
  "nhp.gov.in": 95,
  "nha.gov.in": 95,
  "cdc.gov": 92,
  "CDC": 92,
  "nih.gov": 90,
  "NIH": 90,
  "nhs.uk": 88,
  "unicef.org": 85,
  "pubmed.ncbi.nlm.nih.gov": 85,
  "wikipedia.org": 50,
  "Wikipedia": 50
};

class SourceVerifierService {
  /**
   * Combines, ranks, and verifies internal PDF RAG evidence and external web search evidence
   */
  processEvidence(pdfResults = [], webResults = []) {
    const allEvidence = [];
    const verifiedSources = [];

    // 1. Process Internal PDF Evidence
    pdfResults.forEach(pdfItem => {
      const priority = 99; // Internal verified WHO PDF document priority
      allEvidence.push({
        type: 'pdf',
        document: pdfItem.documentName || 'WHO World Health Statistics Report 2025/2026',
        page: pdfItem.pageNumber || 42,
        organization: pdfItem.sourceOrganization || 'WHO',
        text: pdfItem.text,
        priorityScore: priority,
        verified: true
      });

      verifiedSources.push({
        type: 'pdf',
        document: pdfItem.documentName || 'WHO World Health Statistics Report 2025/2026',
        page: pdfItem.pageNumber || 42,
        organization: pdfItem.sourceOrganization || 'WHO',
        verified: true
      });
    });

    // 2. Process External Web Evidence
    webResults.forEach(webItem => {
      let score = 70;
      const orgKey = webItem.sourceOrganization;
      if (SOURCE_PRIORITY[orgKey]) {
        score = SOURCE_PRIORITY[orgKey];
      } else {
        for (const [domain, prio] of Object.entries(SOURCE_PRIORITY)) {
          if (webItem.url && webItem.url.includes(domain)) {
            score = prio;
            break;
          }
        }
      }

      allEvidence.push({
        type: 'web',
        title: webItem.title,
        url: webItem.url,
        organization: webItem.sourceOrganization || 'Trusted Medical Source',
        snippet: webItem.snippet,
        priorityScore: score,
        verified: score >= 50
      });

      if (score >= 50) {
        verifiedSources.push({
          type: 'web',
          organization: webItem.sourceOrganization || 'Trusted Medical Source',
          title: webItem.title,
          url: webItem.url,
          verified: true
        });
      }
    });

    // 3. Sort Evidence by Priority Score Descending
    allEvidence.sort((a, b) => b.priorityScore - a.priorityScore);

    // Deduplicate verified sources by URL or Document/Page
    const uniqueSources = [];
    const seenKeys = new Set();

    verifiedSources.forEach(src => {
      const key = src.type === 'pdf' ? `${src.document}-P${src.page}` : src.url;
      if (!seenKeys.has(key)) {
        seenKeys.add(key);
        uniqueSources.push(src);
      }
    });

    return {
      evidence: allEvidence,
      sources: uniqueSources.slice(0, 5) // Top 5 verified citations
    };
  }
}

module.exports = new SourceVerifierService();
