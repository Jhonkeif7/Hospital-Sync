import { Link } from "react-router-dom";
import { Plus, Pencil } from "lucide-react";
import type { CalendarDay } from "@/types/calendar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ReminderCard } from "@/components/calendar/ReminderCard";

interface DayDetailContentProps {
  selectedDay: CalendarDay;
  showEditDay?: boolean;
}

export function DayDetailContent({ selectedDay, showEditDay = false }: DayDetailContentProps) {
  return (
    <div className="space-y-5">
      <Badge className="w-fit">{selectedDay.isServiceDay ? "Día de servicio" : "Día libre"}</Badge>

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
          <Pencil className="h-4 w-4 text-stone-400" />
        </CardHeader>
        <CardContent>
          <Textarea
            readOnly
            value={
              selectedDay.notes ??
              "Añade notas sobre protocolos, pacientes o recordatorios del servicio."
            }
            className="resize-none border-none bg-stone-50/80 shadow-none focus-visible:ring-0"
          />
        </CardContent>
      </Card>

      <div className="space-y-3">
        <h3 className="text-left text-sm font-semibold text-stone-800">Recordatorios</h3>
        {selectedDay.reminders.length > 0 ? (
          selectedDay.reminders.map((reminder) => (
            <ReminderCard key={reminder.id} reminder={reminder} />
          ))
        ) : (
          <p className="text-left text-sm text-stone-500">Sin recordatorios para este día.</p>
        )}
        <Button variant="secondary" className="w-full justify-center rounded-xl">
          <Plus className="h-4 w-4" />
          Agregar recordatorio
        </Button>
      </div>

      {showEditDay ? (
        <Button className="w-full rounded-xl py-6 text-base">Editar día</Button>
      ) : null}
    </div>
  );
}
