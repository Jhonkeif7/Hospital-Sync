import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { useTopics } from "@/context/TopicsContext";
import { useServiceCalendar } from "@/hooks/useServiceCalendar";
import { useIsDesktop } from "@/hooks/useMediaQuery";
import { groupCalendarDaysByMonth } from "@/lib/calendarMonths";
import { AppHeader } from "@/components/layout/AppHeader";
import { PageShell } from "@/components/layout/PageShell";
import { CalendarFilters } from "@/components/filters/CalendarFilters";
import { DayDetailsPanel } from "@/components/calendar/DayDetailsPanel";
import { MobileCalendarFooter } from "@/components/calendar/MobileCalendarFooter";
import { StatsSummary } from "@/components/calendar/StatsSummary";
import { ServiceCalendar } from "@/features/service-calendar/ServiceCalendar";

export function CalendarPage() {
  const navigate = useNavigate();
  const isDesktop = useIsDesktop();
  const {
    selectedDate,
    selectedDay,
    filteredDays,
    stats,
    filters,
    setSelectedDate,
    goToToday,
    goToPreviousWeek,
    goToNextWeek,
    updateFilters,
    weekCount,
  } = useServiceCalendar();
  const { topics } = useTopics();

  const monthSections = useMemo(() => groupCalendarDaysByMonth(filteredDays), [filteredDays]);

  const initialMonthIndex = useMemo(() => {
    const key = format(selectedDate, "yyyy-MM");
    const index = monthSections.findIndex((section) => section.key === key);
    return index >= 0 ? index : 0;
  }, [monthSections, selectedDate]);

  const [mobileMonthIndex, setMobileMonthIndex] = useState(initialMonthIndex);

  useEffect(() => {
    setMobileMonthIndex(initialMonthIndex);
  }, [initialMonthIndex]);

  const displayStats = { ...stats, topicsCount: topics.length };

  const handleSelectDate = (date: Date) => {
    setSelectedDate(date);
    if (!isDesktop) {
      navigate(`/dia/${format(date, "yyyy-MM-dd")}`);
    }
  };

  const handleToday = () => {
    goToToday();
    if (!isDesktop) {
      const todayKey = format(new Date(), "yyyy-MM-dd");
      const index = monthSections.findIndex((s) => todayKey.startsWith(s.key));
      if (index >= 0) setMobileMonthIndex(index);
    }
  };

  return (
    <PageShell
      fullHeightBody
      header={
        <>
          <AppHeader
            title="Calendario de Servicio"
            subtitle={`Próximas ${weekCount} semanas`}
          />
          <CalendarFilters
            filters={filters}
            onFiltersChange={updateFilters}
            onToday={handleToday}
            onPreviousWeek={goToPreviousWeek}
            onNextWeek={goToNextWeek}
          />
        </>
      }
    >
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden xl:flex-row">
        <div className="min-h-0 flex-1 overflow-y-auto">
          <ServiceCalendar
            days={filteredDays}
            selectedDate={selectedDate}
            serviceOnlyFilter={filters.serviceFilter === "service-only"}
            compact={!isDesktop}
            mobileMonthIndex={mobileMonthIndex}
            onMobileMonthChange={setMobileMonthIndex}
            onSelectDate={handleSelectDate}
          />
          <div className="hidden xl:block">
            <StatsSummary stats={displayStats} />
          </div>
          <MobileCalendarFooter />
        </div>

        <DayDetailsPanel selectedDay={selectedDay} />
      </div>
    </PageShell>
  );
}
