import { useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { CalendarDay } from "@/types/calendar";
import type { MonthCalendarSection } from "@/lib/calendarMonths";
import { CalendarCell } from "@/components/calendar/CalendarCell";
import { groupCalendarDaysByMonth } from "@/lib/calendarMonths";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const WEEKDAY_LABELS = ["LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB", "DOM"];

interface ServiceCalendarProps {
  days: CalendarDay[];
  selectedDate: Date;
  serviceOnlyFilter: boolean;
  compact?: boolean;
  mobileMonthIndex?: number;
  onMobileMonthChange?: (index: number) => void;
  onSelectDate: (date: Date) => void;
}

function MonthGrid({
  section,
  selectedDate,
  serviceOnlyFilter,
  compact,
  onSelectDate,
}: {
  section: MonthCalendarSection;
  selectedDate: Date;
  serviceOnlyFilter: boolean;
  compact: boolean;
  onSelectDate: (date: Date) => void;
}) {
  return (
    <>
      <div className={cn("mb-2 grid grid-cols-7", compact ? "gap-1" : "gap-2")}>
        {WEEKDAY_LABELS.map((label) => (
          <div
            key={`${section.key}-${label}`}
            className="px-0.5 text-center text-[10px] font-medium uppercase tracking-wide text-stone-500 sm:text-xs"
          >
            {label}
          </div>
        ))}
      </div>

      <div className={cn("space-y-1", !compact && "space-y-2")}>
        {section.weeks.map((week, weekIndex) => (
          <div
            key={`${section.key}-week-${weekIndex}`}
            className={cn("grid grid-cols-7", compact ? "gap-1" : "gap-2")}
          >
            {week.map((day) => (
              <CalendarCell
                key={day.date.toISOString()}
                day={day}
                selectedDate={selectedDate}
                serviceOnlyFilter={serviceOnlyFilter}
                compact={compact}
                onSelect={onSelectDate}
              />
            ))}
          </div>
        ))}
      </div>
    </>
  );
}

export function ServiceCalendar({
  days,
  selectedDate,
  serviceOnlyFilter,
  compact = false,
  mobileMonthIndex = 0,
  onMobileMonthChange,
  onSelectDate,
}: ServiceCalendarProps) {
  const monthSections = useMemo(() => groupCalendarDaysByMonth(days), [days]);

  const visibleSections = compact
    ? monthSections.slice(mobileMonthIndex, mobileMonthIndex + 1)
    : monthSections;

  const canGoPrev = compact && mobileMonthIndex > 0;
  const canGoNext = compact && mobileMonthIndex < monthSections.length - 1;

  return (
    <div className={cn("space-y-10 py-5", compact ? "space-y-6 px-4" : "px-6")}>
      {visibleSections.map((section, sectionIndex) => (
        <section key={section.key} className="space-y-3 sm:space-y-4">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-left text-base font-medium capitalize text-stone-800 sm:text-lg">
              {section.label}
            </h2>
            {compact && onMobileMonthChange ? (
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-lg"
                  disabled={!canGoPrev}
                  onClick={() => onMobileMonthChange(mobileMonthIndex - 1)}
                  aria-label="Mes anterior"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-lg"
                  disabled={!canGoNext}
                  onClick={() => onMobileMonthChange(mobileMonthIndex + 1)}
                  aria-label="Mes siguiente"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            ) : null}
          </div>

          <MonthGrid
            section={section}
            selectedDate={selectedDate}
            serviceOnlyFilter={serviceOnlyFilter}
            compact={compact}
            onSelectDate={onSelectDate}
          />

          {!compact && sectionIndex < monthSections.length - 1 ? (
            <div className="border-b border-stone-200/60 pt-2" />
          ) : null}
        </section>
      ))}
    </div>
  );
}
