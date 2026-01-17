"use client";

import React, { useState, useRef } from 'react';
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

    setIsProcessing(true);
    setProgress(5);
    setStatus(locale === 'ar' ? 'بدء معالجة الملف...' : 'Initializing ingestion...');

    try {
      // In a real scenario, we'd handle multi-page PDFs by converting them to images first.
      // For this MVP, we will assume the input is an Image or we just process text if it's a dummy PDF.
      // Note: Tesseract.js works best on Images. For PDF, we usually need pdf.js to render canvas.
      
      // MOCKING THE DECISION: If PDF, we mock extraction for speed/demo. If Image, we actually run Tesseract.
      let fullText = "";
      
      if (file.type.includes('image')) {
        setStatus(locale === 'ar' ? 'جاري استخراج النص (OCR) بدقة عالية...' : 'Running high-precision OCR...');
        setProgress(30);
        fullText = await processImage(file);
        setProgress(80);
      } else {
         // Mocking PDF extraction for now to avoid massive pdf.js complexity in Step 1
         // In Phase 18 proper, we would add pdf.js
         await new Promise(r => setTimeout(r, 2000));
         fullText = "Sample text extracted from PDF... [Real PDF extraction requires pdf.js integration]";
         toast.success(locale === 'ar' ? 'تمت المحاكاة لملف PDF' : 'PDF simulated');
         setProgress(80);
      }

      setStatus(locale === 'ar' ? 'حفظ الكتاب في قاعدة البيانات المحلية...' : 'Saving to local secure vault...');
      
      const newBook: Textbook = {
        title: bookMetadata.title,
        subject: bookMetadata.subject,
        grade: bookMetadata.grade,
        fullText: fullText,
        chapters: [], // We'll verify parsing later
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const id = await db.textbooks.add(newBook);
      
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
        <div className={cn(
            "border-2 border-dashed rounded-2xl p-8 text-center transition-all",
            file ? "border-green-500 bg-green-50/10" : "border-muted hover:border-primary/50 hover:bg-muted/50"
        )}>
             <input 
                type="file" 
                id="book-upload" 
                className="hidden" 
                accept="image/*,.pdf" // Accepting images for OCR demo
                onChange={handleFileChange}
             />
             <label htmlFor="book-upload" className="cursor-pointer block space-y-3">
                {file ? (
                    <div className="flex flex-col items-center gap-2 text-green-600">
                        <CheckCircle2 className="w-8 h-8" />
                        <p className="font-bold">{file.name}</p>
                        <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <Upload className="w-8 h-8" />
                        <p className="font-medium">{locale === 'ar' ? 'اضغط لرفع الكتاب (PDF أو صور)' : 'Click to upload Textbook (PDF or Images)'}</p>
                    </div>
                )}
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
    </div>
  );
}
