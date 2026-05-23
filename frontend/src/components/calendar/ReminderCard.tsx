import { Clock } from "lucide-react";
import type { Reminder } from "@/types/calendar";

interface ReminderCardProps {
  reminder: Reminder;
}

export function ReminderCard({ reminder }: ReminderCardProps) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-stone-200/80 bg-stone-50/60 px-3 py-2.5">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white">
        <Clock className="h-4 w-4 text-stone-500" />
      </div>
      <div className="min-w-0 text-left">
        <p className="text-xs font-medium text-stone-500">{reminder.time}</p>
        <p className="text-sm text-stone-800">{reminder.title}</p>
      </div>
    </div>
  );
}
