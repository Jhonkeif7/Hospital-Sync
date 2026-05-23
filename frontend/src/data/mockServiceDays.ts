import {
  addDays,
  differenceInCalendarDays,
  eachDayOfInterval,
  endOfWeek,
  format,
  isSameDay,
  isToday,
  startOfDay,
  startOfWeek,
} from "date-fns";
import { es } from "date-fns/locale";
import type { CalendarDay, CalendarStats, Reminder } from "@/types/calendar";
import type { CalendarTopicDisplay, MedicalTopic } from "@/types/medicalTopic";
import { PERIOD_WEEKS, SERVICE_START_DATE } from "@/lib/calendarConfig";
import type { PeriodFilter } from "@/types/calendar";

export const SERVICE_INTERVAL_DAYS = 4;

const mockNotesByDate: Record<string, string> = {
  "2026-05-21":
    "Revisar protocolo de ingreso en planta de medicina interna. Llevar bata, fonendoscopio y guía de antibióticos del hospital.",
  "2026-05-25":
    "Coordinar con residente de guardia la presentación del caso de las 08:00.",
};

const mockRemindersByDate: Record<string, Reminder[]> = {
  "2026-05-21": [
    { id: "r1", time: "07:00", title: "Pase de visita" },
    { id: "r2", time: "12:30", title: "Presentación de caso clínico" },
    { id: "r3", time: "18:00", title: "Revisar notas del día" },
  ],
  "2026-05-25": [
    { id: "r4", time: "07:30", title: "Revisar analíticas de la noche" },
    { id: "r5", time: "14:00", title: "Sesión de semiología" },
  ],
};

export function getPeriodWeeks(period: PeriodFilter): number {
  return PERIOD_WEEKS[period];
}

export function getCalendarRangeStart(referenceDate: Date = new Date()): Date {
  return startOfWeek(startOfDay(referenceDate), { weekStartsOn: 1 });
}

export function getCalendarRangeEnd(startDate: Date, weeks: number): Date {
  return addDays(startDate, weeks * 7 - 1);
}

export function getServiceAnchor(): Date {
  return SERVICE_START_DATE;
}

export function isServiceDay(date: Date, anchorDate: Date): boolean {
  const daysSinceAnchor = differenceInCalendarDays(startOfDay(date), startOfDay(anchorDate));
  return daysSinceAnchor >= 0 && daysSinceAnchor % SERVICE_INTERVAL_DAYS === 0;
}

function getDateKey(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

function toCalendarTopic(
  topic: MedicalTopic,
  getCategoryName: (id: string) => string,
): CalendarTopicDisplay {
  return {
    id: topic.id,
    title: topic.title,
    categoryId: topic.categoryId,
    presentationDate: topic.presentationDate,
    categoryName: getCategoryName(topic.categoryId),
  };
}

export function buildCalendarDays(
  visibleStart: Date,
  rangeStart: Date,
  rangeEnd: Date,
  serviceAnchor: Date,
  topics: MedicalTopic[],
  getCategoryName: (id: string) => string,
): CalendarDay[] {
  const gridStart = startOfWeek(visibleStart, { weekStartsOn: 1 });
  const gridEnd = endOfWeek(rangeEnd, { weekStartsOn: 1 });

  const topicsByDate = topics.reduce<Record<string, CalendarTopicDisplay[]>>((acc, topic) => {
    const key = topic.presentationDate;
    const display = toCalendarTopic(topic, getCategoryName);
    acc[key] = acc[key] ? [...acc[key], display] : [display];
    return acc;
  }, {});

  return eachDayOfInterval({ start: gridStart, end: gridEnd }).map((date) => {
    const dateKey = getDateKey(date);
    const isInRange = date >= rangeStart && date <= rangeEnd;
    const serviceDay = isInRange && isServiceDay(date, serviceAnchor);
    const dayTopics = topicsByDate[dateKey] ?? [];

    return {
      date,
      isServiceDay: serviceDay,
      isInRange,
      topics: dayTopics,
      notes: mockNotesByDate[dateKey],
      reminders: mockRemindersByDate[dateKey] ?? [],
    };
  });
}

export function getCalendarStats(days: CalendarDay[], weeks: number): CalendarStats {
  const inRangeDays = days.filter((day) => day.isInRange);
  const serviceDays = inRangeDays.filter((day) => day.isServiceDay);
  const uniqueTopics = new Set(
    inRangeDays.flatMap((day) => day.topics.map((topic) => topic.id)),
  );

  const withContent = serviceDays.filter((day) => day.topics.length > 0);

  const organizationPercent =
    serviceDays.length === 0
      ? 0
      : Math.round((withContent.length / serviceDays.length) * 100);

  return {
    serviceDays: serviceDays.length,
    weeks,
    topicsCount: uniqueTopics.size,
    organizationPercent,
  };
}

export function formatSelectedDate(date: Date): string {
  return format(date, "EEEE, d 'de' MMMM", { locale: es });
}

export function formatMonthYear(date: Date): string {
  return format(date, "MMMM yyyy", { locale: es });
}

export { isSameDay, isToday };
