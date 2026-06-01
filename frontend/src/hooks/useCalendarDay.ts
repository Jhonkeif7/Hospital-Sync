import { useEffect, useMemo } from "react";
import { endOfWeek, isSameDay, startOfWeek } from "date-fns";
import { formatDateKey, useCalendar } from "@/context/CalendarContext";
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
  const { serviceDaysByDate, remindersByDate, loadForRange } = useCalendar();

  const rangeStart = useMemo(() => getCalendarRangeStart(), []);
  const rangeEnd = useMemo(
    () => getCalendarRangeEnd(rangeStart, periodWeeks),
    [rangeStart, periodWeeks],
  );
  const serviceAnchor = useMemo(() => getServiceAnchor(), []);
  const gridStart = useMemo(
    () => startOfWeek(rangeStart, { weekStartsOn: 1 }),
    [rangeStart],
  );
  const gridEnd = useMemo(
    () => endOfWeek(rangeEnd, { weekStartsOn: 1 }),
    [rangeEnd],
  );

  useEffect(() => {
    void loadForRange(formatDateKey(gridStart), formatDateKey(gridEnd));
  }, [gridStart, gridEnd, loadForRange]);

  return useMemo(() => {
    if (!date) return undefined;

    const days = buildCalendarDays(
      rangeStart,
      rangeStart,
      rangeEnd,
      serviceAnchor,
      topics,
      getCategoryName,
      serviceDaysByDate,
      remindersByDate,
    );

    return days.find((day) => isSameDay(day.date, date));
  }, [
    date,
    rangeStart,
    rangeEnd,
    serviceAnchor,
    topics,
    getCategoryName,
    serviceDaysByDate,
    remindersByDate,
  ]);
}
