import { useMemo, useState } from "react";
import {
  addWeeks,
  isSameDay,
  startOfDay,
  subWeeks,
} from "date-fns";
import { useTopics } from "@/context/TopicsContext";
import {
  buildCalendarDays,
  getCalendarRangeEnd,
  getCalendarRangeStart,
  getCalendarStats,
  getServiceAnchor,
} from "@/data/mockServiceDays";
import { PERIOD_WEEKS } from "@/lib/calendarConfig";
import {
  topicMatchesDateFilter,
  topicMatchesSearch,
} from "@/lib/topicFilters";
import type { CalendarDay, CalendarFiltersState } from "@/types/calendar";
import type { CalendarTopicDisplay } from "@/types/medicalTopic";

const defaultFilters: CalendarFiltersState = {
  period: "10-weeks",
  topicDateFilter: "all",
  customDateFrom: "",
  customDateTo: "",
  serviceFilter: "all",
  searchQuery: "",
};

function filterDayTopics(
  topics: CalendarTopicDisplay[],
  filters: CalendarFiltersState,
  allTopicsForMatch: ReturnType<typeof useTopics>["topics"],
): CalendarTopicDisplay[] {
  return topics.filter((displayTopic) => {
    const full = allTopicsForMatch.find((t) => t.id === displayTopic.id);
    if (!full) return filters.topicDateFilter === "all";

    if (filters.topicDateFilter !== "all") {
      if (
        !topicMatchesDateFilter(
          full,
          filters.topicDateFilter,
          filters.customDateFrom,
          filters.customDateTo,
        )
      ) {
        return false;
      }
    }

    if (filters.searchQuery.trim()) {
      if (!topicMatchesSearch(full, filters.searchQuery)) return false;
    }

    return true;
  });
}

export function useServiceCalendar() {
  const { topics, getCategoryName } = useTopics();
  const [selectedDate, setSelectedDate] = useState<Date>(() => startOfDay(new Date()));
  const [visibleStart, setVisibleStart] = useState<Date>(() => getCalendarRangeStart());
  const [filters, setFilters] = useState<CalendarFiltersState>(defaultFilters);

  const weekCount = PERIOD_WEEKS[filters.period];

  const rangeStart = useMemo(() => getCalendarRangeStart(), []);
  const rangeEnd = useMemo(
    () => getCalendarRangeEnd(rangeStart, weekCount),
    [rangeStart, weekCount],
  );
  const serviceAnchor = useMemo(() => getServiceAnchor(), []);

  const allDays = useMemo(
    () => buildCalendarDays(visibleStart, rangeStart, rangeEnd, serviceAnchor, topics, getCategoryName),
    [visibleStart, rangeStart, rangeEnd, serviceAnchor, topics, getCategoryName],
  );

  const filteredDays = useMemo(() => {
    const searchActive = filters.searchQuery.trim().length > 0;
    const topicFilterActive = filters.topicDateFilter !== "all";

    return allDays.map((day) => {
      if (!day.isInRange) return day;

      const filteredTopics = filterDayTopics(day.topics, filters, topics);

      const hasSearchMatch =
        searchActive &&
        filteredTopics.length > 0 &&
        day.topics.some((dt) => {
          const full = topics.find((t) => t.id === dt.id);
          return full && topicMatchesSearch(full, filters.searchQuery);
        });

      const isSearchHighlighted = searchActive && hasSearchMatch;

      const shouldDim =
        (topicFilterActive || searchActive) &&
        filteredTopics.length === 0 &&
        day.isInRange;

      return {
        ...day,
        topics: topicFilterActive || searchActive ? filteredTopics : day.topics,
        isSearchHighlighted,
        isInRange: shouldDim ? day.isInRange : day.isInRange,
      };
    });
  }, [allDays, filters, topics]);

  const selectedDay = useMemo<CalendarDay | undefined>(() => {
    return filteredDays.find((day) => isSameDay(day.date, selectedDate));
  }, [filteredDays, selectedDate]);

  const stats = useMemo(() => getCalendarStats(allDays, weekCount), [allDays, weekCount]);

  const goToToday = () => {
    const today = startOfDay(new Date());
    setSelectedDate(today);
    setVisibleStart(getCalendarRangeStart(today));
  };

  const goToPreviousWeek = () => {
    setVisibleStart((current) => subWeeks(current, 1));
  };

  const goToNextWeek = () => {
    setVisibleStart((current) => addWeeks(current, 1));
  };

  const updateFilters = (partial: Partial<CalendarFiltersState>) => {
    setFilters((current) => ({ ...current, ...partial }));
  };

  return {
    selectedDate,
    selectedDay,
    filteredDays,
    allDays,
    stats,
    filters,
    rangeStart,
    rangeEnd,
    weekCount,
    setSelectedDate,
    goToToday,
    goToPreviousWeek,
    goToNextWeek,
    updateFilters,
  };
}
