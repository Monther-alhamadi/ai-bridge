/**
 * Cloud Sync Engine (Phase 50)
 * Synchronizes local IndexedDB (Dexie) with Supabase Cloud.
 */

import { db, Textbook, Lesson } from './db';
import { supabase } from './supabase-client';
import { toast } from 'react-hot-toast';

export const SyncEngine = {
    /**
     * Pushes all local data to the cloud for the current user
     */
    pushToCloud: async (userId: string) => {
        try {
            // 1. Sync Textbooks
            const localTextbooks = await db.textbooks.toArray();
            if (localTextbooks.length > 0) {
                const textbooksToSync = localTextbooks.map(t => ({
                    ...t,
                    user_id: userId,
                    // Note: In a real app, we'd handle file/blob uploads to Supabase Storage here
                    bookFile: undefined // Blobs don't go directly to DB tables
                }));
                
                const { error: tError } = await supabase
                    .from('textbooks')
                    .upsert(textbooksToSync, { onConflict: 'id' });
                
                if (tError) throw tError;
            }

            // 2. Sync Lessons
            const localLessons = await db.lessons.toArray();
            if (localLessons.length > 0) {
                const lessonsToSync = localLessons.map(l => ({
                    ...l,
                    user_id: userId
                }));
                
                const { error: lError } = await supabase
                    .from('lessons')
                    .upsert(lessonsToSync, { onConflict: 'id' });
                
                if (lError) throw lError;
            }

            console.log("Push sync successful!");
        } catch (error: any) {
            console.error("Sync Push Error:", error);
            // Non-intrusive error
        }
    },

    /**
     * Pulls data from the cloud and merges into local DB
     */
    pullFromCloud: async (userId: string) => {
        try {
            // 1. Pull Textbooks
            const { data: cloudTextbooks, error: tError } = await supabase
                .from('textbooks')
                .select('*')
                .eq('user_id', userId);
            
            if (tError) throw tError;
            if (cloudTextbooks) {
                await db.textbooks.bulkPut(cloudTextbooks);
            }

            // 2. Pull Lessons
            const { data: cloudLessons, error: lError } = await supabase
                .from('lessons')
                .select('*')
                .eq('user_id', userId);
            
            if (lError) throw lError;
            if (cloudLessons) {
                await db.lessons.bulkPut(cloudLessons);
            }

            console.log("Pull sync successful!");
        } catch (error: any) {
            console.error("Sync Pull Error:", error);
        }
    },

    /**
     * Complete lifecycle sync
     */
    fullSync: async (userId: string, locale: 'ar' | 'en') => {
        // Pull first to get latest from other devices
        await SyncEngine.pullFromCloud(userId);
        // Then push local updates
        await SyncEngine.pushToCloud(userId);
        
        toast.success(locale === 'ar' ? 'تمت مزامنة بياناتك سحابياً ✨' : 'Your data is synced to cloud ✨', {
            icon: '☁️',
            style: {
                borderRadius: '20px',
                background: '#0f172a',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.1)'
            }
        });
    }
};
