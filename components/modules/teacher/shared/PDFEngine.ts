import { GlobalWorkerOptions, getDocument } from 'pdfjs-dist';
import { createWorker } from 'tesseract.js';

// Configure worker src (Use CDN to avoid Next.js webpack issues)
GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

export interface ExtractedChapter {
  title: string;
  page?: number;
  context?: string;
}

export class PDFEngine {
  
    /**
     * STAGE 1: THE NEURAL SCOUT
     * Uses AI to extract structured TOC from noisy text.
     */
    static async scanForTOC(file: File, locale: 'ar' | 'en', subject: string): Promise<{ 
        chapters: ExtractedChapter[], 
        initialText: string, 
        detectedLanguage: 'ar' | 'en',
        aiMetadata?: { summary?: string, grade?: string } 
    }> {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await getDocument(arrayBuffer).promise;
        const totalPages = pdf.numPages;
        
        const range = Math.min(15, totalPages);
        let accumulatedText = "";

        for (let i = 1; i <= range; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            
            if (textContent.items.length > 30) {
                const strings = textContent.items.map((item: any) => item.str);
                accumulatedText += strings.join(" ") + "\n";
            } else {
                accumulatedText += await this.ocrPage(page, locale);
            }
        }

        console.log("PDFEngine: Starting Semantic AI Analysis. Text size:", accumulatedText.length);
        
        // Language detection heuristic
        const arabicRegex = /[\u0600-\u06FF]/g;
        const arabicChars = accumulatedText.match(arabicRegex) || [];
        const detectedLanguage: 'ar' | 'en' = arabicChars.length > (accumulatedText.length * 0.1) ? 'ar' : 'en';
        console.log(`PDFEngine: Detected Language: ${detectedLanguage} (${arabicChars.length} chars)`);
        
        try {
            const aiResult = await this.parseWithAI(accumulatedText, locale, subject);
            console.log("PDFEngine: AI Result received:", aiResult);

            if (aiResult && aiResult.chapters) {
                const processedChapters = aiResult.chapters.map((c: any) => ({
                    title: typeof c === 'string' ? c : (c.title || "Untitled Lesson"),
                    context: `Extracted via Neural AI ${c.page ? `- Page ${c.page}` : ''}`
                }));
                
                return { 
                    chapters: processedChapters, 
                    initialText: accumulatedText,
                    detectedLanguage,
                    aiMetadata: {
                        summary: aiResult.summary,
                        grade: aiResult.grade || aiResult.metadata?.grade
                    }
                };
            }
        } catch (err) {
            console.error("PDFEngine: AI Parsing failed, falling back to Regex:", err);
        }

        const chapters = this.parseTOCText(accumulatedText, locale);
        return { chapters, initialText: accumulatedText, detectedLanguage };
    }

    private static async parseWithAI(text: string, locale: 'ar' | 'en', subject: string): Promise<any> {
        const fd = new FormData();
        fd.append('tool', 'book-indexer');
        fd.append('profession', 'teacher');
        fd.append('params', JSON.stringify({
            subject: subject,
            language: locale,
            context: text.substring(0, 12000) // Truncate to fit context window
        }));

        const response = await fetch('/api/ai/generate', {
            method: 'POST',
            body: fd
        });

        if (!response.ok) throw new Error("AI extraction failed");
        return await response.json();
    }

    /**
     * STAGE 3: DEEP INDEXER
     * Processes the remaining pages of the PDF in the background.
     * Updates the database incrementally with extracted text.
     */
     static async deepIndex(
             file: File, 
             bookId: number, 
             startPage: number, 
             locale: 'ar' | 'en',
             onProgress?: (progress: number) => void
     ): Promise<void> {
         // Dynamic Import to avoid circular dependencies if any, though db is safe
         const { db } = await import('@/lib/db');
         
         const arrayBuffer = await file.arrayBuffer();
         const pdf = await getDocument(arrayBuffer).promise;
         const totalPages = pdf.numPages;
         
         if (startPage > totalPages) return;
 
         let accumulatedText = "";
         const CHUNK_SIZE = 5; // Process 5 pages at a time to yield to UI
         
         for (let i = startPage; i <= totalPages; i++) {
             try {
                 const page = await pdf.getPage(i);
                 const textContent = await page.getTextContent();
                 
                 // Check if scanned
                 if (textContent.items.length > 20) {
                     const strings = textContent.items.map((item: any) => item.str);
                     accumulatedText += strings.join(" ") + "\n";
                 } else {
                     // If scanned, run OCR (Expensive!)
                     // For Deep Indexing, we might want to skip full OCR on every page in background 
                     // to save resources, OR do it very slowly.
                     // For now, let's do it but maybe with a delay?
                     accumulatedText += await this.ocrPage(page, locale) + "\n";
                 }
                 
                 // Update DB every CHUNK_SIZE pages
                 if (i % CHUNK_SIZE === 0 || i === totalPages) {
                     // Append to existing fullText
                     const book = await db.textbooks.get(bookId);
                     if (book) {
                         await db.textbooks.update(bookId, {
                             fullText: (book.fullText || "") + accumulatedText
                         });
                         accumulatedText = ""; // Reset buffer
                     }
                     
                     if (onProgress) {
                         onProgress(Math.round((i / totalPages) * 100));
                     }
                     
                     // Yield to main thread
                     await new Promise(r => setTimeout(r, 100));
                 }
             } catch (err) {
                 console.error(`Error indexing page ${i}`, err);
             }
         }
     }
 
    /**
     * STAGE 2: NEURAL VISION
     * Renders a PDF page to high-res canvas and runs Tesseract OCR.
     */
    static async ocrPage(page: any, locale: 'ar' | 'en'): Promise<string> {
        // 1. Render to Canvas (High Scale for better OCR)
        const viewport = page.getViewport({ scale: 2.0 });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({
            canvasContext: context,
            viewport: viewport
        }).promise;

        const imageBlob = await new Promise<Blob | null>(resolve => 
             canvas.toBlob(resolve, 'image/png')
        );

        if(!imageBlob) return "";

        // 2. Run Tesseract
        const worker = await createWorker(
            // @ts-ignore
            locale === 'ar' ? 'ara' : 'eng'
        );
        const { data: { text } } = await worker.recognize(imageBlob);
        await worker.terminate();
        
        return text;
    }

    /**
     * STAGE 3: INTELLIGENT PARSER
     * Regex heuristics to detect Unit/Chapter/Lesson patterns.
     */
    static parseTOCText(text: string, locale: 'ar' | 'en'): ExtractedChapter[] {
        const chapters: ExtractedChapter[] = [];
        const lines = text.split('\n');

        // Regex patterns for Arabic and English TOCs
        // Regex patterns for Arabic and English TOCs
        const patterns = locale === 'ar' 
            ? [
                /(?:الوحدة|الفصل|الباب|الجزء)\s+(?:الأول|الثاني|الثالث|الرابع|الخامس|السادس|السابع|الثامن|التاسع|العاشر|\d+)\s*[:\-\.]?\s*(.+)/,
                /(?:الدرس)\s+(?:الأول|الثاني|الثالث|الرابع|الخامس|\d+)\s*[:\-\.]?\s*(.+)/,
                /^\s*\d+[\-\.]\s+(.+)/,
                /(?:الموضوع|العنوان)\s*[:\-\.]?\s*(.+)/,
                // Match "Title ....... PageNumber" format (common in PDFs)
                /(.+?)\s*[\.]{3,}\s*\d+/
              ]
            : [
                /(?:Unit|Chapter|Section)\s+\d+\s*[:\-\.]?\s*(.+)/i,
                /(?:Lesson)\s+\d+\s*[:\-\.]?\s*(.+)/i,
                /^\s*\d+[\-\.]\s+(.+)/,
                /(.+?)\s*[\.]{3,}\s*\d+/
              ];

        console.log("Parsing TOC with locale:", locale);
        lines.forEach(line => {
            const cleanLine = line.trim();
            // log every line to see what we are dealing with
            // console.log("Line:", cleanLine); 
            
            for (const pattern of patterns) {
                const match = cleanLine.match(pattern);
                if (match) {
                     // Heuristic: Filter out too short or too long lines (noise)
                     if(match[0].length > 5 && match[0].length < 100) {
                        console.log("MATCH FOUND:", match[0]);
                        chapters.push({
                            title: match[0],
                            context: 'Extracted from TOC' 
                        });
                     }
                     break; 
                }
            }
        });

        // Fallback: If no chapters found, return empty (Caller handles this)
        return chapters;
    }
}
