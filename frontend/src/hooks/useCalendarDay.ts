import { useMemo } from "react";
import { isSameDay } from "date-fns";
import { useTopics } from "@/context/TopicsContext";
import {
  buildCalendarDays,
  getCalendarRangeEnd,
  getCalendarRangeStart,
  getServiceAnchor,
} from "@/data/mockServiceDays";
import type { CalendarDay } from "@/types/calendar";

export function useCalendarDay(date: Date | null, periodWeeks = 10): CalendarDay | undefined {
  const { topics, getCategoryName } = useTopics();

  return useMemo(() => {
    if (!date) return undefined;

    const rangeStart = getCalendarRangeStart();
    const rangeEnd = getCalendarRangeEnd(rangeStart, periodWeeks);
    const serviceAnchor = getServiceAnchor();
    const days = buildCalendarDays(
      rangeStart,
      rangeStart,
      rangeEnd,
      serviceAnchor,
      topics,
      getCategoryName,
    );

    return days.find((day) => isSameDay(day.date, date));
  }, [date, topics, getCategoryName, periodWeeks]);
}
