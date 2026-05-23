import { useMemo } from "react";
import { Navigate, useParams } from "react-router-dom";
import { format, parse, isValid } from "date-fns";
import { es } from "date-fns/locale";
import { useCalendarDay } from "@/hooks/useCalendarDay";
import { useIsDesktop } from "@/hooks/useMediaQuery";
import { DayDetailHeader } from "@/components/layout/DayDetailHeader";
import { DayDetailContent } from "@/components/calendar/DayDetailContent";

export function DayDetailPage() {
  const { date: dateParam } = useParams<{ date: string }>();
  const isDesktop = useIsDesktop();

  const parsedDate = useMemo(() => {
    if (!dateParam) return null;
    const date = parse(dateParam, "yyyy-MM-dd", new Date());
    return isValid(date) ? date : null;
  }, [dateParam]);

  const selectedDay = useCalendarDay(parsedDate);

  if (isDesktop) {
    return <Navigate to="/" replace />;
  }

  if (!parsedDate || !selectedDay) {
    return <Navigate to="/" replace />;
  }

  const headerTitle = format(parsedDate, "EEEE, d 'de' MMMM", { locale: es });

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-stone-50">
      <DayDetailHeader title={headerTitle} />
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 pb-8">
        <DayDetailContent selectedDay={selectedDay} showEditDay />
      </div>
    </div>
  );
}
