import React, { ChangeEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload } from 'lucide-react';

interface PrintHeaderProps {
  schoolName: string;
  setSchoolName: (val: string) => void;
  teacherName: string;
  setTeacherName: (val: string) => void;
  logo: string | null;
  setLogo: (val: string | null) => void;
  locale: 'en' | 'ar';
}

export function PrintHeader({
  schoolName,
  setSchoolName,
  teacherName,
  setTeacherName,
  logo,
  setLogo,
  locale
}: PrintHeaderProps) {
  
  const handleLogoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-muted/30 border border-border/50 rounded-xl p-5 space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          {locale === 'ar' ? 'تخصيص الهيدر (للطباعة)' : 'Print Header Customization'}
        </h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Logo Upload */}
        <div className="flex flex-col gap-2">
          <Label className="text-xs">
            {locale === 'ar' ? 'شعار المدرسة' : 'School Logo'}
          </Label>
          <div className="flex items-center gap-3">
             <div className="relative w-12 h-12 rounded-lg border-2 border-dashed border-muted-foreground/20 flex items-center justify-center overflow-hidden bg-background">
                {logo ? (
                  <img src={logo} alt="Logo" className="w-full h-full object-contain" />
                ) : (
                  <Upload className="w-4 h-4 text-muted-foreground/50" />
                )}
             </div>
             <Input 
               type="file" 
               accept="image/*" 
               onChange={handleLogoUpload}
               className="text-xs h-9 file:text-[10px]"
             />
          </div>
        </div>

        {/* School Name */}
        <div className="flex flex-col gap-2">
           <Label htmlFor="schoolName" className="text-xs">
             {locale === 'ar' ? 'اسم المدرسة' : 'School Name'}
           </Label>
           <Input 
             id="schoolName"
             value={schoolName}
             onChange={(e) => setSchoolName(e.target.value)}
             placeholder={locale === 'ar' ? 'مثال: مدارس المستقبل' : 'e.g. Future Schools'}
             className="h-9 bg-background/50"
           />
        </div>

        {/* Teacher Name */}
        <div className="flex flex-col gap-2">
           <Label htmlFor="teacherName" className="text-xs">
             {locale === 'ar' ? 'اسم المعلم' : 'Teacher Name'}
           </Label>
           <Input 
             id="teacherName"
             value={teacherName}
             onChange={(e) => setTeacherName(e.target.value)}
             placeholder={locale === 'ar' ? 'أ. محمد أحمد' : 'Mr. John Doe'}
             className="h-9 bg-background/50"
           />
        </div>
      </div>
    </div>
  );
}
