import { formatSelectedDate } from "@/data/mockServiceDays";
import type { CalendarDay } from "@/types/calendar";
import { DayDetailContent } from "@/components/calendar/DayDetailContent";

interface DayDetailsPanelProps {
  selectedDay?: CalendarDay;
}

export function DayDetailsPanel({ selectedDay }: DayDetailsPanelProps) {
  if (!selectedDay) {
    return (
      <aside className="hidden h-full w-[340px] shrink-0 flex-col overflow-y-auto border-l border-stone-200/80 bg-white p-6 xl:flex">
        <p className="text-sm text-stone-500">Selecciona un día del calendario</p>
      </aside>
    );
  }

  const formattedDate = formatSelectedDate(selectedDay.date);

  return (
    <aside className="hidden h-full w-[340px] shrink-0 flex-col overflow-y-auto border-l border-stone-200/80 bg-white p-6 xl:flex">
      <h2 className="mb-5 text-left text-lg font-semibold capitalize text-stone-800">
        {formattedDate}
      </h2>
      <DayDetailContent selectedDay={selectedDay} />
    </aside>
  );
}
