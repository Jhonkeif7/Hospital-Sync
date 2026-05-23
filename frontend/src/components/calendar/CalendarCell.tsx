import { format } from "date-fns";
import { isSameDay, isToday } from "@/data/mockServiceDays";
import type { CalendarDay } from "@/types/calendar";
import { cn } from "@/lib/utils";

/** Verde suave acorde al sistema (beige / stone) */
const TOPIC_BG = "bg-[#dfe8df]";
const TOPIC_BORDER = "border-[#b8d4bc]";
const TOPIC_ACCENT_BORDER = "border-[#5a8f6a]";
const SERVICE_BG = "bg-[#e0d0b8]";
const SERVICE_BORDER = "border-[#c9b896]";

interface CalendarCellProps {
  day: CalendarDay;
  selectedDate: Date;
  serviceOnlyFilter: boolean;
  compact?: boolean;
  onSelect: (date: Date) => void;
}

export function CalendarCell({
  day,
  selectedDate,
  serviceOnlyFilter,
  compact = false,
  onSelect,
}: CalendarCellProps) {
  const isSelected = isSameDay(day.date, selectedDate);
  const isCurrentDay = isToday(day.date);
  const isMuted = !day.isInRange || (serviceOnlyFilter && day.isInRange && !day.isServiceDay);
  const isService = day.isServiceDay && day.isInRange;
  const isHighlighted = Boolean(day.isSearchHighlighted);
  const hasTopics = day.isInRange && day.topics.length > 0;
  const isServiceWithTopics = isService && hasTopics;
  const isTopicOnlyDay = hasTopics && !isService;
  const isServiceOnly = isService && !hasTopics;

  return (
    <button
      type="button"
      onClick={() => onSelect(day.date)}
      className={cn(
        "group flex flex-col rounded-xl border text-left transition-all",
        compact ? "min-h-[100px] gap-1 p-1.5" : "min-h-[92px] p-2",

        /* Día con temas (sin servicio): fondo verde */
        isTopicOnlyDay && !isHighlighted && [TOPIC_BG, TOPIC_BORDER, "shadow-sm"],
        isTopicOnlyDay && isHighlighted && [
          TOPIC_BG,
          TOPIC_BORDER,
          "ring-2 ring-amber-400 ring-offset-1",
        ],

        /* Solo servicio: beige oscuro */
        isServiceOnly && !isHighlighted && [SERVICE_BG, SERVICE_BORDER, "shadow-sm"],
        isServiceOnly && isHighlighted && [
          SERVICE_BG,
          SERVICE_BORDER,
          "ring-2 ring-amber-400 ring-offset-1",
        ],

        /* Servicio + temas: beige + borde verde marcado */
        isServiceWithTopics && !isHighlighted && [
          SERVICE_BG,
          SERVICE_BORDER,
          "border-2",
          TOPIC_ACCENT_BORDER,
          "shadow-sm",
        ],
        isServiceWithTopics && isHighlighted && [
          SERVICE_BG,
          "border-2",
          TOPIC_ACCENT_BORDER,
          "ring-2 ring-amber-400 ring-offset-1",
          "shadow-sm",
        ],

        /* Día normal */
        !isService && !hasTopics && !isHighlighted && "border-stone-200/70 bg-white",
        !isService && !hasTopics && isHighlighted &&
          "border-amber-300 bg-amber-50/80 ring-2 ring-amber-400 ring-offset-1 shadow-sm",

        isSelected && !isHighlighted && !compact && "ring-2 ring-stone-400 ring-offset-2",
        isSelected && !isHighlighted && compact && "ring-2 ring-stone-500",
        isMuted && "opacity-40",
        !day.isInRange && "border-stone-200/50 bg-stone-50/50",
      )}
    >
      <div className={cn("flex items-start justify-between", compact ? "px-0.5" : "")}>
        <span
          className={cn(
            "font-medium",
            compact ? "text-xs" : "text-sm",
            day.isInRange ? "text-stone-800" : "text-stone-400",
            isCurrentDay &&
              "flex h-6 w-6 items-center justify-center rounded-full bg-stone-800 text-white text-xs",
          )}
        >
          {format(day.date, "d")}
        </span>
        {isHighlighted ? (
          <span className="h-2 w-2 shrink-0 rounded-full bg-amber-500" title="Coincide con búsqueda" />
        ) : null}
        {isService && !compact && !isHighlighted ? (
          <span className="text-[10px] font-semibold text-stone-700">• Servicio</span>
        ) : null}
      </div>

      {(isService || hasTopics) && day.isInRange ? (
        <div
          className={cn(
            "mt-auto flex flex-col overflow-hidden",
            compact ? "gap-0.5 px-0.5 pb-0.5" : "gap-1",
          )}
        >
          {compact ? (
            <>
              {isService ? (
                <span className="text-[10px] font-semibold text-stone-800">Servicio</span>
              ) : null}
              {hasTopics ? (
                <>
                  {day.topics.length >= 2 ? (
                    <span
                      className={cn(
                        "text-[10px]",
                        hasTopics && !isService ? "text-[#3d6b4a]" : "text-stone-600",
                      )}
                    >
                      {day.topics.length} temas
                    </span>
                  ) : null}
                  <span
                    className={cn(
                      "line-clamp-2 text-[10px] leading-tight",
                      isHighlighted
                        ? "font-medium text-amber-900"
                        : hasTopics
                          ? "font-medium text-[#2f5a3c]"
                          : "text-stone-700",
                    )}
                  >
                    {day.topics[0].title}
                  </span>
                  {day.topics.length > 2 ? (
                    <span className="text-[10px] text-stone-500">
                      +{day.topics.length - 1} más
                    </span>
                  ) : null}
                </>
              ) : null}
            </>
          ) : (
            <>
              {day.topics.slice(0, 2).map((topic) => (
                <span
                  key={topic.id}
                  className={cn(
                    "inline-flex rounded-lg px-1.5 py-0.5 text-[10px] ring-1",
                    isHighlighted
                      ? "bg-amber-100/90 font-medium text-amber-900 ring-amber-300"
                      : hasTopics
                        ? "bg-white/85 text-[#2f5a3c] ring-[#9bc4a3]"
                        : isService
                          ? "bg-white/90 text-stone-800 ring-stone-300/80"
                          : "bg-white/80 text-stone-700 ring-stone-200/70",
                  )}
                >
                  {topic.title}
                </span>
              ))}
              {day.topics.length > 2 ? (
                <span className="text-[10px] text-stone-500">+{day.topics.length - 2} más</span>
              ) : null}
            </>
          )}
        </div>
      ) : null}
    </button>
  );
}
