/**
 * Calendar Utility (Phase 46)
 * Generates ICS files for calendar integration.
 */

export interface CalendarEvent {
    title: string;
    description: string;
    startTime: Date;
    durationMinutes: number;
    location?: string;
}

export const CalendarUtils = {
    /**
     * Generates a standard ICS string from an array of events
     */
    generateICS: (events: CalendarEvent[]): string => {
        let icsContent = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'PRODID:-//AI Bridge//Teacher OS//EN',
            'CALSCALE:GREGORIAN',
            'METHOD:PUBLISH'
        ];

        events.forEach(event => {
            const startStr = CalendarUtils.formatToICSDate(event.startTime);
            const endTime = new Date(event.startTime.getTime() + event.durationMinutes * 60000);
            const endStr = CalendarUtils.formatToICSDate(endTime);
            const nowStr = CalendarUtils.formatToICSDate(new Date());

            icsContent.push(
                'BEGIN:VEVENT',
                `UID:${Math.random().toString(36).substring(2)}@aibridge.app`,
                `DTSTAMP:${nowStr}`,
                `DTSTART:${startStr}`,
                `DTEND:${endStr}`,
                `SUMMARY:${event.title}`,
                `DESCRIPTION:${event.description.replace(/\n/g, '\\n')}`,
                `LOCATION:${event.location || ''}`,
                'END:VEVENT'
            );
        });

        icsContent.push('END:VCALENDAR');
        return icsContent.join('\r\n');
    },

    /**
     * Formats a Date object to YYYYMMDDTHHMMSSZ
     */
    formatToICSDate: (date: Date): string => {
        return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    },

    /**
     * Triggers a browser download of the ICS file
     */
    downloadICS: (filename: string, content: string) => {
        const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
};
