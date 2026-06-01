import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Reminder } from "@/types/calendar";

export interface ReminderFormValues {
  time: string;
  title: string;
  description: string;
}

interface ReminderFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode?: "create" | "edit";
  reminder?: Reminder;
  onSubmit: (values: ReminderFormValues) => void | Promise<void>;
  isSubmitting?: boolean;
}

export function ReminderFormDialog({
  open,
  onOpenChange,
  mode = "create",
  reminder,
  onSubmit,
  isSubmitting = false,
}: ReminderFormDialogProps) {
  const [time, setTime] = useState("08:00");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (open) {
      setTime(reminder?.time ?? "08:00");
      setTitle(reminder?.title ?? "");
      setDescription(reminder?.description ?? "");
    }
  }, [open, reminder]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!title.trim() || !time.trim()) return;

    await onSubmit({
      time: time.trim(),
      title: title.trim(),
      description: description.trim(),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Agregar recordatorio" : "Editar recordatorio"}
          </DialogTitle>
          <DialogDescription>
            Programa un recordatorio para este día de servicio.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-2 text-left">
            <Label htmlFor="reminder-time">Hora</Label>
            <Input
              id="reminder-time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="rounded-xl"
              required
            />
          </div>

          <div className="space-y-2 text-left">
            <Label htmlFor="reminder-title">Título</Label>
            <Input
              id="reminder-title"
              placeholder="Ej. Pase de visita"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="rounded-xl"
              required
            />
          </div>

          <div className="space-y-2 text-left">
            <Label htmlFor="reminder-description">Descripción (opcional)</Label>
            <Textarea
              id="reminder-description"
              placeholder="Detalles adicionales…"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[80px] resize-none rounded-xl"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting || !title.trim()}>
              {isSubmitting ? "Guardando…" : mode === "create" ? "Agregar" : "Guardar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
