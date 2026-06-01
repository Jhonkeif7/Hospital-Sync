import { Clock, Trash2 } from "lucide-react";
import type { Reminder } from "@/types/calendar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ReminderCardProps {
  reminder: Reminder;
  onToggleCompleted?: (reminderId: string, isCompleted: boolean) => void;
  onDelete?: (reminder: Reminder) => void;
  isUpdating?: boolean;
}

export function ReminderCard({
  reminder,
  onToggleCompleted,
  onDelete,
  isUpdating = false,
}: ReminderCardProps) {
  const completed = Boolean(reminder.isCompleted);

  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-xl border border-stone-200/80 px-3 py-2.5",
        completed ? "bg-stone-100/80" : "bg-stone-50/60",
      )}
    >
      <label className="mt-2 flex shrink-0 cursor-pointer items-center">
        <input
          type="checkbox"
          checked={completed}
          disabled={isUpdating}
          onChange={(event) =>
            onToggleCompleted?.(reminder.id, event.target.checked)
          }
          className="h-4 w-4 rounded border-stone-300 text-[#9a8268] focus:ring-[#e8dfd1]"
          aria-label={`Marcar "${reminder.title}" como completado`}
        />
      </label>

      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white">
        <Clock className="h-4 w-4 text-stone-500" />
      </div>

      <div className="min-w-0 flex-1 text-left">
        <p className="text-xs font-medium text-stone-500">{reminder.time}</p>
        <p
          className={cn(
            "text-sm text-stone-800",
            completed && "text-stone-400 line-through",
          )}
        >
          {reminder.title}
        </p>
        {reminder.description ? (
          <p
            className={cn(
              "mt-0.5 text-xs text-stone-500",
              completed && "text-stone-400 line-through",
            )}
          >
            {reminder.description}
          </p>
        ) : null}
      </div>

      {onDelete ? (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0 text-stone-400 hover:text-red-600"
          disabled={isUpdating}
          onClick={() => onDelete(reminder)}
          aria-label={`Eliminar recordatorio ${reminder.title}`}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      ) : null}
    </div>
  );
}
