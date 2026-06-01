import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Loader2, Plus, Pencil } from "lucide-react";
import { DeleteReminderDialog } from "@/components/calendar/DeleteReminderDialog";
import { ReminderCard } from "@/components/calendar/ReminderCard";
import {
  ReminderFormDialog,
  type ReminderFormValues,
} from "@/components/calendar/ReminderFormDialog";
import { formatDateKey, useCalendar } from "@/context/CalendarContext";
import type { CalendarDay, Reminder } from "@/types/calendar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface DayDetailContentProps {
  selectedDay: CalendarDay;
  showEditDay?: boolean;
}

export function DayDetailContent({ selectedDay, showEditDay = false }: DayDetailContentProps) {
  const {
    createServiceDay,
    updateServiceDay,
    createReminder,
    deleteReminder,
    toggleReminderCompleted,
  } = useCalendar();

  const [notes, setNotes] = useState(selectedDay.notes ?? "");
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [reminderFormOpen, setReminderFormOpen] = useState(false);
  const [isSavingReminder, setIsSavingReminder] = useState(false);
  const [deletingReminder, setDeletingReminder] = useState<Reminder | null>(null);
  const [isDeletingReminder, setIsDeletingReminder] = useState(false);
  const [updatingReminderId, setUpdatingReminderId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    setNotes(selectedDay.notes ?? "");
    setActionError(null);
  }, [selectedDay.date, selectedDay.notes, selectedDay.serviceDayId]);

  const saveNotes = useCallback(async () => {
    const trimmed = notes.trim();
    const currentNotes = selectedDay.notes?.trim() ?? "";

    if (trimmed === currentNotes) return;

    setIsSavingNotes(true);
    setActionError(null);

    try {
      const serviceDate = formatDateKey(selectedDay.date);

      if (selectedDay.serviceDayId) {
        await updateServiceDay({
          serviceDayId: selectedDay.serviceDayId,
          notes: trimmed || null,
          isServiceDay: selectedDay.isServiceDay,
        });
      } else if (trimmed || selectedDay.isServiceDay) {
        await createServiceDay({
          serviceDate,
          notes: trimmed || null,
          isServiceDay: selectedDay.isServiceDay,
        });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "No se pudieron guardar las notas.";
      setActionError(message);
    } finally {
      setIsSavingNotes(false);
    }
  }, [createServiceDay, notes, selectedDay, updateServiceDay]);

  const handleNotesBlur = () => {
    void saveNotes();
  };

  const handleCreateReminder = async (values: ReminderFormValues) => {
    setIsSavingReminder(true);
    setActionError(null);

    try {
      await createReminder({
        reminderDate: formatDateKey(selectedDay.date),
        time: values.time,
        title: values.title,
        description: values.description || null,
        serviceDayId: selectedDay.serviceDayId ?? null,
        isCompleted: false,
      });
      setReminderFormOpen(false);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "No se pudo crear el recordatorio.";
      setActionError(message);
    } finally {
      setIsSavingReminder(false);
    }
  };

  const handleToggleReminder = async (reminderId: string, isCompleted: boolean) => {
    setUpdatingReminderId(reminderId);
    setActionError(null);

    try {
      await toggleReminderCompleted(reminderId, isCompleted);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "No se pudo actualizar el recordatorio.";
      setActionError(message);
    } finally {
      setUpdatingReminderId(null);
    }
  };

  const handleDeleteReminder = async () => {
    if (!deletingReminder) return;

    setIsDeletingReminder(true);
    setActionError(null);

    try {
      await deleteReminder(deletingReminder.id);
      setDeletingReminder(null);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "No se pudo eliminar el recordatorio.";
      setActionError(message);
    } finally {
      setIsDeletingReminder(false);
    }
  };

  return (
    <div className="space-y-5">
      <Badge className="w-fit">{selectedDay.isServiceDay ? "Día de servicio" : "Día libre"}</Badge>

      {actionError ? (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-left text-sm text-red-600">
          {actionError}
        </p>
      ) : null}

      <Card className="border-stone-200/80 shadow-none">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Temas del día</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {selectedDay.topics.length > 0 ? (
            <ul className="space-y-3 text-left text-sm text-stone-700">
              {selectedDay.topics.map((topic) => (
                <li key={topic.id} className="space-y-0.5">
                  <div className="flex gap-2">
                    <span className="text-stone-400">•</span>
                    <span className="font-medium">{topic.title}</span>
                  </div>
                  <p className="pl-4 text-xs text-stone-500">{topic.categoryName}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-left text-sm text-stone-500">No hay temas asignados.</p>
          )}
          <Link
            to="/temas"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[#9a7b4f] hover:text-stone-800"
          >
            <Plus className="h-4 w-4" />
            Agregar tema
          </Link>
        </CardContent>
      </Card>

      <Card className="border-stone-200/80 shadow-none">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-sm">Notas</CardTitle>
          <div className="flex items-center gap-2 text-stone-400">
            {isSavingNotes ? (
              <span className="flex items-center gap-1 text-xs text-stone-500">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Guardando…
              </span>
            ) : (
              <Pencil className="h-4 w-4" />
            )}
          </div>
        </CardHeader>
        <CardContent>
          <Textarea
            data-day-notes
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            onBlur={handleNotesBlur}
            placeholder="Añade notas sobre protocolos, pacientes o recordatorios del servicio."
            disabled={isSavingNotes}
            className={cn(
              "min-h-[100px] resize-none border-stone-200/80 bg-stone-50/80 shadow-none",
              "focus-visible:ring-1 focus-visible:ring-stone-300",
            )}
          />
        </CardContent>
      </Card>

      <div className="space-y-3">
        <h3 className="text-left text-sm font-semibold text-stone-800">Recordatorios</h3>
        {selectedDay.reminders.length > 0 ? (
          selectedDay.reminders.map((reminder) => (
            <ReminderCard
              key={reminder.id}
              reminder={reminder}
              onToggleCompleted={handleToggleReminder}
              onDelete={setDeletingReminder}
              isUpdating={updatingReminderId === reminder.id}
            />
          ))
        ) : (
          <p className="text-left text-sm text-stone-500">Sin recordatorios para este día.</p>
        )}
        <Button
          variant="secondary"
          className="w-full justify-center rounded-xl"
          onClick={() => setReminderFormOpen(true)}
        >
          <Plus className="h-4 w-4" />
          Agregar recordatorio
        </Button>
      </div>

      {showEditDay ? (
        <Button
          type="button"
          className="w-full rounded-xl py-6 text-base"
          onClick={() => {
            const textarea = document.querySelector<HTMLTextAreaElement>(
              "[data-day-notes]",
            );
            textarea?.focus();
          }}
        >
          Editar día
        </Button>
      ) : null}

      <ReminderFormDialog
        open={reminderFormOpen}
        onOpenChange={setReminderFormOpen}
        onSubmit={handleCreateReminder}
        isSubmitting={isSavingReminder}
      />

      <DeleteReminderDialog
        reminder={deletingReminder}
        open={Boolean(deletingReminder)}
        onOpenChange={(open) => !open && setDeletingReminder(null)}
        onConfirm={handleDeleteReminder}
        isDeleting={isDeletingReminder}
      />
    </div>
  );
}
