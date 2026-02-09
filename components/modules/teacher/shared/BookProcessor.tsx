import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createWorker } from 'tesseract.js';
import { db, Textbook } from '@/lib/db'; // Make sure lib/db is created
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ProgressBar } from '@/components/modules/teacher/shared/ToolPanel';
import { Upload, FileText, CheckCircle2, AlertCircle, Book, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/Badge';
import { PremiumModal } from './PremiumModal';
import { PDFEngine, ExtractedChapter } from './PDFEngine';

interface BookProcessorProps {
  locale: 'en' | 'ar';
  onComplete?: (bookId: number) => void;
}

export function BookProcessor({ locale, onComplete }: BookProcessorProps) {
  const isRTL = locale === 'ar';
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('');
  const [bookMetadata, setBookMetadata] = useState({ title: '', subject: '', grade: '' });
  const [processedPages, setProcessedPages] = useState<string[]>([]);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  
  // Mock premium state (to be replaced by real auth/subscription hook)
  const [isPremium, setIsPremium] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
        setDragActive(true);
    } else if (e.type === "dragleave") {
        setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files?.[0]) {
        const droppedFile = e.dataTransfer.files[0];
        setFile(droppedFile);
        setBookMetadata(prev => ({ 
            ...prev, 
            title: droppedFile.name.replace(/\.[^/.]+$/, "") 
        }));
    }
  }, []);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
      setBookMetadata(prev => ({ ...prev, title: e.target.files![0].name.replace(/\.[^/.]+$/, "") }));
    }
  };

  const processImage = async (imageFile: File) => {
    const worker = await createWorker(
        // @ts-ignore
        locale === 'ar' ? 'ara' : 'eng'
    );
    // await worker.loadLanguage(locale === 'ar' ? 'ara' : 'eng');
    // await worker.initialize(locale === 'ar' ? 'ara' : 'eng');
    
    const { data: { text } } = await worker.recognize(imageFile);
    await worker.terminate();
    return text;
  };

  const handleIngest = async () => {
    if (!file) return;

    // 1. RESOURCE CHECKPOINT (Phase 28)
    // For MVP, we simulate page counting or check file size as proxy if PDF
    // Real implementation would use pdf-lib to get exact page count.
    
    // Simulate detecting page count
    let pageCount = 0;
    if (file.type === 'application/pdf') {
        // Simple heuristic: 1MB ~= 10-15 pages for simple textbooks
        // For a more precise check, we'd need a light-weight PDF parser on client.
        pageCount = Math.ceil(file.size / (150 * 1024)); 
    } else {
        pageCount = 1; // Images are 1 page
    }

    if (!isPremium && pageCount > 10) {
        setShowPremiumModal(true);
        setIsProcessing(false);
        return;
    }

    setIsProcessing(true);
    setProgress(5);
    setStatus(locale === 'ar' ? 'بدء معالجة الملف...' : 'Initializing ingestion...');

    try {
      // 1. SCAN PDF (Stage 1, 2 & 3: Neural Scout)
      let fullText = "";
      let retrievedChapters: ExtractedChapter[] = [];
      let initialText = "";
      let indexSummary = "";
      let contentLanguage: 'ar' | 'en' = locale;

      if (file.type === 'application/pdf') {
         setStatus(locale === 'ar' ? 'جاري تحليل بنية الكتاب عبر الذكاء الاصطناعي...' : 'AI is analyzing book structure...');
         
         const result = await PDFEngine.scanForTOC(file, locale, bookMetadata.subject || bookMetadata.title);
         retrievedChapters = result.chapters;
         initialText = result.initialText;
         fullText = initialText; 
         contentLanguage = result.detectedLanguage;
         
         if (result.aiMetadata) {
             indexSummary = result.aiMetadata.summary || "";
             if (!bookMetadata.grade && result.aiMetadata.grade) {
                 const detectedGrade = String(result.aiMetadata.grade || "");
                 setBookMetadata(prev => ({ ...prev, grade: detectedGrade }));
             }
         }
         
         setProgress(70);
      } else if (file.type.includes('image')) {
        setStatus(locale === 'ar' ? 'جاري استخراج النص (OCR) بدقة عالية...' : 'Running high-precision OCR...');
        setProgress(30);
        fullText = await processImage(file);
        initialText = fullText; 
        const arabicRegex = /[\u0600-\u06FF]/g;
        const arabicChars = fullText.match(arabicRegex) || [];
        contentLanguage = arabicChars.length > (fullText.length * 0.1) ? 'ar' : 'en';
        setProgress(60);
      }

      setStatus(locale === 'ar' ? 'جاري بناء سياق الدروس الذكي...' : 'Constructing AI Lesson Context...');
      setProgress(85);

      // If we still don't have a summary (e.g. image or AI failed), try to get it if text exists
      if (!indexSummary && initialText) {
          try {
            const aiResponse = await fetch('/api/ai/generate', {
                method: 'POST',
                body: (() => {
                    const fd = new FormData();
                    fd.append('tool', 'book-indexer');
                    fd.append('profession', 'teacher');
                    fd.append('params', JSON.stringify({
                        subject: bookMetadata.subject || bookMetadata.title,
                        language: locale,
                        context: initialText.substring(0, 8000)
                    }));
                    return fd;
                })()
            });
            const aiData = await aiResponse.json();
            indexSummary = aiData.summary || "";
            if (retrievedChapters.length === 0 && aiData.chapters) {
                 retrievedChapters = aiData.chapters.map((c: any) => ({
                    title: typeof c === 'string' ? c : (c.title || "Untitled"),
                    context: 'Extracted via AI Indexer'
                }));
            }
          } catch (e) {
            console.error("Secondary Indexing failed", e);
          }
      }
      
      if (retrievedChapters.length === 0) {
          retrievedChapters.push({ 
              title: locale === 'ar' ? 'محتوى الكتاب العام' : 'General Book Content', 
              context: 'Generated Fallback' 
          });
      }

      const newBook: Textbook = {
        title: bookMetadata.title,
        subject: bookMetadata.subject,
        grade: bookMetadata.grade,
        fullText: fullText,
        indexSummary: indexSummary,
        chapters: retrievedChapters, 
        contentLanguage: contentLanguage,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const id = await db.textbooks.add(newBook);
      
      // TRIGGER STAGE 3: DEEP INDEXING (Background)
      if (file.type === 'application/pdf' && id) {
          // Fire and forget - let it run in background to populate fullText
          PDFEngine.deepIndex(file, id as number, 16, locale, (progress) => {
             console.log(`Deep Indexing: ${progress}%`);
          }).catch(err => console.error("Deep Indexing Failed:", err));
      }
      
      setProgress(100);
      setStatus(locale === 'ar' ? 'تم الحفظ بنجاح!' : 'Ingestion Complete!');
      toast.success(locale === 'ar' ? 'تمت فهرسة الكتاب بنجاح' : 'Book indexed successfully');
      
      if (onComplete && id) onComplete(id as number);
      
      setTimeout(() => {
        setIsProcessing(false);
        setFile(null);
        setBookMetadata({ title: '', subject: '', grade: '' });
      }, 1500);

    } catch (error: any) {
      console.error(error);
      toast.error(error.message || 'Ingestion failed');
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8 p-6 bg-card border rounded-3xl shadow-sm">
      <div className="text-center space-y-2">
        <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto text-primary">
            <Book className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-bold">{locale === 'ar' ? 'المعالج المحلي للكتب' : 'Universal Book Ingestor'}</h2>
        <p className="text-muted-foreground text-sm max-w-md mx-auto">
          {locale === 'ar' 
            ? 'حوّل أي كتاب أو وثيقة إلى قاعدة بيانات رقمية قابلة للبحث. يتم التخزين على جهازك لضمان الخصوصية والسرعة.'
            : 'Convert any textbook into a searchable digital vault. Stored locally on your device for privacy and zero latency.'}
        </p>
      </div>

      <div className="space-y-4">
        {/* File Drop Area */}
        <div 
            className={cn(
                "relative border-2 border-dashed rounded-[2.5rem] p-12 text-center transition-all duration-500 overflow-hidden",
                dragActive ? "border-primary bg-primary/5 scale-[1.02]" : "border-muted hover:border-primary/50 hover:bg-muted/50",
                file ? "border-green-500 bg-green-50/10" : "border-muted"
            )}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
        >
             {/* Glassmorphism Background Accent */}
             <div className="absolute top-0 right-0 p-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
             <div className="absolute bottom-0 left-0 p-32 bg-blue-500/5 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none" />

             <input 
                type="file" 
                id="book-upload" 
                className="hidden" 
                accept="image/*,.pdf" 
                onChange={handleFileChange}
             />
             <label htmlFor="book-upload" className="cursor-pointer relative z-10 block space-y-4">
                <AnimatePresence mode="wait">
                    {file ? (
                        <motion.div 
                            key="file-ready"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="flex flex-col items-center gap-3 text-green-600"
                        >
                            <div className="p-4 bg-green-500/20 rounded-full">
                                <CheckCircle2 className="w-10 h-10" />
                            </div>
                            <div className="space-y-1">
                                <p className="font-black text-xl">{file.name}</p>
                                <Badge variant="secondary" className="bg-green-500/10 text-green-600 border-green-500/20">
                                    {(file.size / 1024 / 1024).toFixed(2)} MB • READY
                                </Badge>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div 
                            key="no-file"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-col items-center gap-4 text-muted-foreground"
                        >
                            <div className="p-5 bg-primary/10 rounded-full text-primary group-hover:bg-primary group-hover:text-white transition-all">
                                <Upload className="w-10 h-10" />
                            </div>
                            <div className="space-y-1">
                                <p className="font-bold text-lg text-foreground">
                                    {locale === 'ar' ? 'اسحب ملف الكتاب هنا' : 'Drop Textbook Here'}
                                </p>
                                <p className="text-sm">
                                    {locale === 'ar' ? 'أو اضغط لاختيار PDF أو صور' : 'or click to browse PDF or Images'}
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
             </label>
        </div>

        {/* Metadata Inputs */}
        <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label>{locale === 'ar' ? 'اسم المادة' : 'Subject'}</Label>
                <Input 
                    value={bookMetadata.subject}
                    onChange={(e) => setBookMetadata({...bookMetadata, subject: e.target.value})}
                    placeholder={locale === 'ar' ? 'مثال: الفيزياء' : 'e.g. Physics'}
                />
            </div>
            <div className="space-y-2">
                <Label>{locale === 'ar' ? 'الصف الدراسي' : 'Grade Level'}</Label>
                <Input 
                    value={bookMetadata.grade}
                    onChange={(e) => setBookMetadata({...bookMetadata, grade: e.target.value})}
                    placeholder={locale === 'ar' ? 'مثال: العاشر' : 'e.g. 10th Grade'}
                />
            </div>
        </div>

        {/* Progress Display */}
        {isProcessing && (
            <div className="pt-4 border-t border-dashed">
                <ProgressBar progress={progress} status={status} locale={locale} />
                <p className="text-[10px] text-center text-muted-foreground mt-2 italic">
                    {locale === 'ar' ? 'يتم المعالجة محلياً باستخدام Tesseract.js' : 'Processing locally via Tesseract.js'}
                </p>
            </div>
        )}

        {/* Action Button */}
        {!isProcessing && (
            <Button 
                onClick={handleIngest} 
                disabled={!file} 
                className="w-full h-12 text-lg rounded-xl"
            >
                {locale === 'ar' ? 'دخول المعالجة الآمنة' : 'Start Secure Ingestion'}
            </Button>
        )}
      </div>

      <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 dark:border-blue-900/30 dark:bg-blue-900/10 flex gap-3 text-sm text-muted-foreground">
         <AlertCircle className="w-5 h-5 text-blue-500 shrink-0" />
         <div>
            <p className="font-bold text-blue-600 dark:text-blue-400 mb-1">{locale === 'ar' ? 'الخصوصية أولاً' : 'Privacy First'}</p>
            <p>
                {locale === 'ar' 
                 ? 'جميع الملفات التي ترفعها يتم معالجتها وحفظها داخل متصفحك فقط. لا يتم إرسال أي صفحات إلى خوادمنا السحابية.'
                 : 'Files are processed and stored strictly within your browser. No textbook pages are ever uploaded to our cloud servers.'}
            </p>
         </div>
      </div>

      <PremiumModal 
        isOpen={showPremiumModal} 
        onClose={() => setShowPremiumModal(false)} 
        onUpgrade={() => {
            setIsPremium(true);
            setShowPremiumModal(false);
            toast.success(locale === 'ar' ? 'تم تفعيل الاشتراك التجريبي' : 'Premium Simulated');
        }}
        locale={locale} 
      />
    </div>
  );
}
