import { CalendarDays, ChevronLeft, ChevronRight, ListFilter, Search, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PERIOD_LABELS } from "@/lib/calendarConfig";
import type { CalendarFiltersState, PeriodFilter, TopicDateFilter } from "@/types/calendar";
import { cn } from "@/lib/utils";

interface CalendarFiltersProps {
  filters: CalendarFiltersState;
  onFiltersChange: (partial: Partial<CalendarFiltersState>) => void;
  onToday: () => void;
  onPreviousWeek: () => void;
  onNextWeek: () => void;
}

const periodOptions: PeriodFilter[] = ["5-weeks", "10-weeks", "20-weeks"];

const topicDateOptions: { value: TopicDateFilter; label: string }[] = [
  { value: "all", label: "Todos los temas" },
  { value: "this-week", label: "Temas de esta semana" },
  { value: "custom", label: "Rango personalizado" },
];

const selectTriggerClass = "h-11 w-full rounded-xl lg:w-[200px] xl:w-[220px]";

function NavButtons({
  onToday,
  onPreviousWeek,
  onNextWeek,
  className,
}: {
  onToday: () => void;
  onPreviousWeek: () => void;
  onNextWeek: () => void;
  className?: string;
}) {
  return (
    <div className={cn("flex shrink-0 items-center gap-2", className)}>
      <Button variant="secondary" size="sm" className="h-11 rounded-xl px-4" onClick={onToday}>
        Hoy
      </Button>
      <Button variant="outline" size="icon" className="h-11 w-11 rounded-xl" onClick={onPreviousWeek}>
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="icon" className="h-11 w-11 rounded-xl" onClick={onNextWeek}>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}

export function CalendarFilters({
  filters,
  onFiltersChange,
  onToday,
  onPreviousWeek,
  onNextWeek,
}: CalendarFiltersProps) {
  return (
    <div className="flex flex-col gap-3 border-b border-stone-200/80 bg-white px-4 py-4 lg:gap-4 lg:px-6">
      {/* Móvil: período + navegación en la misma fila */}
      <div className="flex items-center gap-2 lg:hidden">
        <Select
          value={filters.period}
          onValueChange={(value) => onFiltersChange({ period: value as PeriodFilter })}
        >
          <SelectTrigger className={cn(selectTriggerClass, "min-w-0 flex-1")}>
            <CalendarDays className="h-4 w-4 shrink-0 text-stone-500" />
            <SelectValue placeholder="Próximas 10 semanas" />
          </SelectTrigger>
          <SelectContent>
            {periodOptions.map((period) => (
              <SelectItem key={period} value={period}>
                {PERIOD_LABELS[period]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <NavButtons onToday={onToday} onPreviousWeek={onPreviousWeek} onNextWeek={onNextWeek} />
      </div>

      {/* Desktop: fila principal — todos los filtros + navegación */}
      <div className="hidden flex-col gap-3 lg:flex">
        <div className="flex flex-wrap items-center gap-3">
          <Select
            value={filters.period}
            onValueChange={(value) => onFiltersChange({ period: value as PeriodFilter })}
          >
            <SelectTrigger className={selectTriggerClass}>
              <CalendarDays className="h-4 w-4 shrink-0 text-stone-500" />
              <SelectValue placeholder="Próximas 10 semanas" />
            </SelectTrigger>
            <SelectContent>
              {periodOptions.map((period) => (
                <SelectItem key={period} value={period}>
                  {PERIOD_LABELS[period]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.topicDateFilter}
            onValueChange={(value) =>
              onFiltersChange({ topicDateFilter: value as TopicDateFilter })
            }
          >
            <SelectTrigger className={selectTriggerClass}>
              <ListFilter className="h-4 w-4 shrink-0 text-stone-500" />
              <SelectValue placeholder="Todos los temas" />
            </SelectTrigger>
            <SelectContent>
              {topicDateOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.serviceFilter}
            onValueChange={(value) =>
              onFiltersChange({
                serviceFilter: value as CalendarFiltersState["serviceFilter"],
              })
            }
          >
            <SelectTrigger className={selectTriggerClass}>
              <Target className="h-4 w-4 shrink-0 text-stone-500" />
              <SelectValue placeholder="Servicio (cada 4 días)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Servicio (cada 4 días)</SelectItem>
              <SelectItem value="service-only">Solo días de servicio</SelectItem>
            </SelectContent>
          </Select>

          <div className="relative min-w-[200px] flex-1 lg:max-w-[280px] xl:max-w-[320px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
            <Input
              type="search"
              placeholder="Buscar por título de tema..."
              className="h-11 w-full rounded-xl pl-9"
              value={filters.searchQuery}
              onChange={(e) => onFiltersChange({ searchQuery: e.target.value })}
            />
          </div>

          <NavButtons
            onToday={onToday}
            onPreviousWeek={onPreviousWeek}
            onNextWeek={onNextWeek}
            className="ml-auto"
          />
        </div>

        {filters.topicDateFilter === "custom" ? (
          <div className="flex flex-wrap items-end gap-3">
            <div className="space-y-1 text-left">
              <Label htmlFor="cal-from-lg" className="text-xs text-stone-500">
                Desde
              </Label>
              <Input
                id="cal-from-lg"
                type="date"
                className="h-10 w-[160px] rounded-xl"
                value={filters.customDateFrom}
                onChange={(e) => onFiltersChange({ customDateFrom: e.target.value })}
              />
            </div>
            <div className="space-y-1 text-left">
              <Label htmlFor="cal-to-lg" className="text-xs text-stone-500">
                Hasta
              </Label>
              <Input
                id="cal-to-lg"
                type="date"
                className="h-10 w-[160px] rounded-xl"
                value={filters.customDateTo}
                onChange={(e) => onFiltersChange({ customDateTo: e.target.value })}
              />
            </div>
          </div>
        ) : null}
      </div>

      {/* Móvil: resto de filtros apilados */}
      <div className="flex flex-col gap-3 lg:hidden">
        <Select
          value={filters.topicDateFilter}
          onValueChange={(value) =>
            onFiltersChange({ topicDateFilter: value as TopicDateFilter })
          }
        >
          <SelectTrigger className={selectTriggerClass}>
            <ListFilter className="h-4 w-4 shrink-0 text-stone-500" />
            <SelectValue placeholder="Todos los temas" />
          </SelectTrigger>
          <SelectContent>
            {topicDateOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {filters.topicDateFilter === "custom" ? (
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1 text-left">
              <Label htmlFor="cal-from" className="text-xs text-stone-500">
                Desde
              </Label>
              <Input
                id="cal-from"
                type="date"
                className="h-10 rounded-xl"
                value={filters.customDateFrom}
                onChange={(e) => onFiltersChange({ customDateFrom: e.target.value })}
              />
            </div>
            <div className="space-y-1 text-left">
              <Label htmlFor="cal-to" className="text-xs text-stone-500">
                Hasta
              </Label>
              <Input
                id="cal-to"
                type="date"
                className="h-10 rounded-xl"
                value={filters.customDateTo}
                onChange={(e) => onFiltersChange({ customDateTo: e.target.value })}
              />
            </div>
          </div>
        ) : null}

        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
          <Input
            type="search"
            placeholder="Buscar por título de tema..."
            className="h-11 rounded-xl pl-9"
            value={filters.searchQuery}
            onChange={(e) => onFiltersChange({ searchQuery: e.target.value })}
          />
        </div>

        <Select
          value={filters.serviceFilter}
          onValueChange={(value) =>
            onFiltersChange({
              serviceFilter: value as CalendarFiltersState["serviceFilter"],
            })
          }
        >
          <SelectTrigger className={selectTriggerClass}>
            <Target className="h-4 w-4 shrink-0 text-stone-500" />
            <SelectValue placeholder="Servicio (cada 4 días)" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Servicio (cada 4 días)</SelectItem>
            <SelectItem value="service-only">Solo días de servicio</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
