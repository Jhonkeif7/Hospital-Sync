import type { CalendarTopicDisplay } from "@/types/medicalTopic";
import { cn } from "@/lib/utils";

interface TopicBadgeProps {
  topic: CalendarTopicDisplay;
  compact?: boolean;
  highlighted?: boolean;
  className?: string;
}

export function TopicBadge({
  topic,
  compact = false,
  highlighted = false,
  className,
}: TopicBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-lg px-2 py-1 text-left ring-1",
        compact ? "text-[10px] leading-tight" : "text-xs",
        highlighted
          ? "bg-amber-100/90 font-medium text-amber-900 ring-amber-300"
          : "bg-white/80 text-stone-700 ring-stone-200/70",
        className,
      )}
      title={topic.title}
    >
      {topic.title}
    </span>
  );
}
