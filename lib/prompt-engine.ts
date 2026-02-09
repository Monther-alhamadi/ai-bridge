/**
 * Prompt Engine (Phase 27)
 * A stateless utility to unify data gathering and pedagogical prompt engineering.
 */

export interface PromptDataObject {
  toolId: string;
  subject: string;
  grade?: string;
  context?: string; // Specific lesson context
  bookMemory?: string; // AI-generated index summary
  params: Record<string, any>;
  locale: 'en' | 'ar';
}

import { SYSTEM_PROMPTS } from './prompts';

export const PromptEngine = {
  /**
    * Orchestrates the construction of a master prompt based on the tool and context
    * mapping data to the specialized templates in lib/prompts.ts
    */
  generatePrompt: (data: PromptDataObject): string => {
    let engineeredPrompt = "";
    
    // 1. Inject Core Identity
    const coreSystem = SYSTEM_PROMPTS.CORE_IDENTITY;

    // 2. Prepare Context Context (Book Memory + User Context)
    const combinedContext = [
        data.bookMemory ? `[Textbook Index]: ${data.bookMemory}` : "",
        data.context ? `[User Notes]: ${data.context}` : ""
    ].filter(Boolean).join("\n");

    switch (data.toolId) {
      case 'lesson-planner':
        // Map data to LESSON_PLANNER template
        engineeredPrompt = SYSTEM_PROMPTS.LESSON_PLANNER(
            combinedContext,
            data.subject,
            data.grade || "General",
            data.params.duration || "45",
            data.locale, // Languge support
            data.params.topic || "", // New Topic Param
            data.params.model || "Standard", 
            data.params.differentiation || false
        );
        break;

      case 'exam-generator':
        // Map data to EXAM_GENERATOR template
        const totalQ = (data.params.mcqCount || 0) + 
                       (data.params.trueFalseCount || 0) + 
                       (data.params.essayCount || 0);
        
        const diffMap = ["Easy", "Easy", "Easy", "Medium", "Hard", "Hard"];
        const difficulty = diffMap[data.params.difficulty || 3] as 'Easy' | 'Medium' | 'Hard';

        engineeredPrompt = SYSTEM_PROMPTS.EXAM_GENERATOR(
            combinedContext,
            data.subject,
            difficulty,
            totalQ,
            data.locale
        );
        break;

      default:
        engineeredPrompt = `Process request: ${JSON.stringify(data.params)}`;
    }

    // Combine into final master prompt
    return `${coreSystem}\n\n${engineeredPrompt}`;
  }
};
