import { parse, startOfDay } from "date-fns";
import type { PeriodFilter } from "@/types/calendar";

/** Primer día de servicio hospitalario (jueves 21 de mayo de 2026) */
export const SERVICE_START_DATE = startOfDay(
  parse("2026-05-21", "yyyy-MM-dd", new Date()),
);

export const PERIOD_WEEKS: Record<PeriodFilter, number> = {
  "5-weeks": 5,
  "10-weeks": 10,
  "20-weeks": 20,
};

export const PERIOD_LABELS: Record<PeriodFilter, string> = {
  "5-weeks": "Próximas 5 semanas",
  "10-weeks": "Próximas 10 semanas",
  "20-weeks": "Próximas 20 semanas",
};
