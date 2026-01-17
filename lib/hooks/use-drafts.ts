import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-hot-toast';

export function useDrafts<T>(toolId: string, initialData: T) {
  const [data, setData] = useState<T>(initialData);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load draft on mount
  useEffect(() => {
    const loadDraft = async () => {
      // 1. Try LocalStorage first for speed
      const localData = localStorage.getItem(`draft-${toolId}`);
      if (localData) {
        setData(JSON.parse(localData));
      }

      // 2. Try Supabase if available
      if (supabase) {
        const { data: remoteData, error } = await supabase
          .from('drafts')
          .select('content')
          .eq('tool_id', toolId)
          .single();

        if (remoteData && !error) {
          setData(remoteData.content as T);
        }
      }
      setIsLoaded(true);
    };

    loadDraft();
  }, [toolId]);

  // Save draft with debounce
  useEffect(() => {
    if (!isLoaded) return;

    const saveDraft = async () => {
      // Save to LocalStorage
      localStorage.setItem(`draft-${toolId}`, JSON.stringify(data));

      // Save to Supabase (if possible)
      if (supabase) {
        // This is a placeholder for actual Supabase UPSERT logic
        // It requires a 'drafts' table to exist
        try {
            await supabase
              .from('drafts')
              .upsert({ 
                tool_id: toolId, 
                content: data,
                updated_at: new Date().toISOString()
              }, { onConflict: 'tool_id' });
        } catch (e) {
            console.error("Supabase Save Error:", e);
        }
      }
      
      // Notify user (only first time or every few changes to not be annoying)
      // Custom toast for "Draft Saved"
      toast.success('Progress saved', {
        id: 'draft-save',
        duration: 2000,
        position: 'bottom-right',
        style: {
          borderRadius: '20px',
          background: '#333',
          color: '#fff',
          fontSize: '12px',
        },
      });
    };

    const timeout = setTimeout(saveDraft, 2000); // 2s debounce
    return () => clearTimeout(timeout);
  }, [data, toolId, isLoaded]);

  return [data, setData, isLoaded] as const;
}
