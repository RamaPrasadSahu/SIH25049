import os
import json
import pypdf

def extract_pdf_knowledge(pdf_path="D:/Dataset/9789240110496-eng.pdf", output_json="ml/data/processed/who_pdf_dataset.json"):
    if not os.path.exists(pdf_path):
        print(f"PDF file not found at {pdf_path}")
        return
        
    print(f"Opening PDF: {pdf_path}...")
    reader = pypdf.PdfReader(pdf_path)
    total_pages = len(reader.pages)
    print(f"Total PDF pages: {total_pages}")
    
    keywords = ["malaria", "dengue", "tuberculosis", "tb", "diabetes", "hypertension", "immunization", "vaccine", "sdg", "mortality", "fever"]
    
    extracted_chunks = []
    
    for idx, page in enumerate(reader.pages):
        try:
            text = page.extract_text()
            if not text:
                continue
                
            text_lower = text.toLowerCase() if hasattr(text, 'toLowerCase') else text.lower()
            
            matching_keywords = [kw for kw in keywords if kw in text_lower]
            if matching_keywords:
                lines = [line.strip() for line in text.split('\n') if len(line.strip()) > 30]
                chunk_summary = " ".join(lines[:6])
                
                extracted_chunks.append({
                    "page": idx + 1,
                    "matchedKeywords": matching_keywords,
                    "summary": chunk_summary[:500]
                })
        except Exception as e:
            continue
            
    print(f"Extracted {len(extracted_chunks)} relevant public health knowledge chunks from PDF.")
    
    result = {
        "source": "WHO World Health Statistics Report (ISBN 9789240110496)",
        "pdfPath": pdf_path,
        "totalPages": total_pages,
        "totalChunks": len(extracted_chunks),
        "chunks": extracted_chunks[:50] # Top 50 structured chunks
    }
    
    os.makedirs(os.path.dirname(output_json), exist_ok=True)
    with open(output_json, 'w', encoding='utf-8') as f:
        json.dump(result, f, indent=2)
        
    print(f"Saved processed PDF dataset to {output_json}")
    return result

if __name__ == "__main__":
    extract_pdf_knowledge()
