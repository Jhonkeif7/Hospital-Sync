import { addDays } from "date-fns";
import {
  endOfMonth,
  endOfWeek,
  format,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { es } from "date-fns/locale";
import type { CalendarDay } from "@/types/calendar";

export interface MonthCalendarSection {
  key: string;
  label: string;
  weeks: CalendarDay[][];
}

export function groupCalendarDaysByMonth(days: CalendarDay[]): MonthCalendarSection[] {
  const inRangeDays = days.filter((day) => day.isInRange);
  if (inRangeDays.length === 0) return [];

  const monthKeys = [
    ...new Set(inRangeDays.map((day) => format(day.date, "yyyy-MM"))),
  ].sort();

  const daysByKey = new Map(
    days.map((day) => [format(day.date, "yyyy-MM-dd"), day]),
  );

  return monthKeys.map((monthKey) => {
    const [year, month] = monthKey.split("-").map(Number);
    const monthDate = new Date(year, month - 1, 1);
    const monthStart = startOfMonth(monthDate);
    const monthEnd = endOfMonth(monthDate);
    const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 });
    const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const sectionDays: CalendarDay[] = [];
    let cursor = gridStart;

    while (cursor <= gridEnd) {
      const key = format(cursor, "yyyy-MM-dd");
      const existing = daysByKey.get(key);
      sectionDays.push(
        existing ?? {
          date: new Date(cursor),
          isServiceDay: false,
          isInRange: false,
          topics: [],
          reminders: [],
        },
      );
      cursor = addDays(cursor, 1);
    }

    const weeks: CalendarDay[][] = [];
    for (let index = 0; index < sectionDays.length; index += 7) {
      weeks.push(sectionDays.slice(index, index + 7));
    }

    return {
      key: monthKey,
      label: format(monthDate, "MMMM yyyy", { locale: es }),
      weeks,
    };
  });
}
