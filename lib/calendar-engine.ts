import { addDays, isSameDay, format } from 'date-fns';

export interface CalendarConfig {
  startDate: Date;
  endDate: Date;
  weeklySchedule: number[]; // [0-6]
  holidays: Date[];
}

export const SmartCalendarEngine = {
  /**
   * Generates a list of all teaching dates within a semester based on config
   */
  generateTeachingDays: (config: CalendarConfig): Date[] => {
    const teachingDays: Date[] = [];
    let currentDate = config.startDate;

    while (currentDate <= config.endDate) {
      const dayOfWeek = currentDate.getDay();
      
      // Check if it's a scheduled teaching day
      const isScheduledDay = config.weeklySchedule.includes(dayOfWeek);
      
      // Check if it's a holiday
      const isHoliday = config.holidays.some(h => isSameDay(h, currentDate));

      if (isScheduledDay && !isHoliday) {
        teachingDays.push(new Date(currentDate));
      }

      currentDate = addDays(currentDate, 1);
    }

    return teachingDays;
  },

  /**
   * Distributes a list of contents (e.g. chapters) across teaching days
   */
  distributeSyllabus: (contents: string[], teachingDays: Date[]) => {
    return teachingDays.map((date, index) => ({
      date,
      title: contents[index % contents.length] || `Lesson ${index + 1}`,
      weekNumber: Math.floor(index / 5) + 1, // Simplified
    }));
  }
};
