import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { format } from "date-fns";
import { useAuth } from "@/context/AuthContext";
import {
  createReminder as createReminderInDb,
  deleteReminder as deleteReminderInDb,
  getRemindersByDateRange,
  mapReminder,
  toggleReminderCompleted as toggleReminderInDb,
  updateReminder as updateReminderInDb,
} from "@/services/remindersService";
import {
  createServiceDay as createServiceDayInDb,
  deleteServiceDay as deleteServiceDayInDb,
  getServiceDaysByDateRange,
  mapServiceDay,
  updateServiceDay as updateServiceDayInDb,
} from "@/services/serviceDaysService";
import type { Reminder } from "@/types/calendar";
import type { ServiceReminder } from "@/types/reminder";
import type { ServiceDay } from "@/types/serviceDay";
import type { ServiceDayLookup } from "@/data/mockServiceDays";

function toCalendarReminder(reminder: ServiceReminder): Reminder {
  return {
    id: reminder.id,
    time: reminder.time,
    title: reminder.title,
    description: reminder.description ?? undefined,
    isCompleted: reminder.isCompleted,
    serviceDayId: reminder.serviceDayId,
    reminderDate: reminder.reminderDate,
  };
}

interface CalendarContextValue {
  serviceDays: ServiceDay[];
  reminders: ServiceReminder[];
  serviceDaysByDate: Record<string, ServiceDayLookup>;
  remindersByDate: Record<string, Reminder[]>;
  isLoading: boolean;
  error: string | null;
  loadForRange: (startDate: string, endDate: string) => Promise<void>;
  createServiceDay: (params: {
    serviceDate: string;
    notes?: string | null;
    isServiceDay?: boolean;
  }) => Promise<ServiceDay>;
  updateServiceDay: (params: {
    serviceDayId: string;
    serviceDate?: string;
    notes?: string | null;
    isServiceDay?: boolean;
  }) => Promise<ServiceDay>;
  deleteServiceDay: (serviceDayId: string) => Promise<void>;
  createReminder: (params: {
    serviceDayId?: string | null;
    reminderDate: string;
    time: string;
    title: string;
    description?: string | null;
    isCompleted?: boolean;
  }) => Promise<ServiceReminder>;
  updateReminder: (params: {
    reminderId: string;
    serviceDayId?: string | null;
    reminderDate?: string;
    time?: string;
    title?: string;
    description?: string | null;
    isCompleted?: boolean;
  }) => Promise<ServiceReminder>;
  deleteReminder: (reminderId: string) => Promise<void>;
  toggleReminderCompleted: (reminderId: string, isCompleted: boolean) => Promise<ServiceReminder>;
}

const CalendarContext = createContext<CalendarContextValue | null>(null);

export function CalendarProvider({ children }: { children: ReactNode }) {
  const { user, isLoading: authLoading } = useAuth();
  const [serviceDays, setServiceDays] = useState<ServiceDay[]>([]);
  const [reminders, setReminders] = useState<ServiceReminder[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const serviceDaysByDate = useMemo(() => {
    const map: Record<string, ServiceDayLookup> = {};
    for (const day of serviceDays) {
      map[day.serviceDate] = {
        id: day.id,
        notes: day.notes,
        isServiceDay: day.isServiceDay,
      };
    }
    return map;
  }, [serviceDays]);

  const remindersByDate = useMemo(() => {
    const map: Record<string, Reminder[]> = {};
    for (const reminder of reminders) {
      const item = toCalendarReminder(reminder);
      const key = reminder.reminderDate;
      map[key] = map[key] ? [...map[key], item] : [item];
    }
    for (const key of Object.keys(map)) {
      map[key].sort((a, b) => a.time.localeCompare(b.time));
    }
    return map;
  }, [reminders]);

  const loadForRange = useCallback(
    async (startDate: string, endDate: string) => {
      if (authLoading) return;

      if (!user?.id) {
        setServiceDays([]);
        setReminders([]);
        setIsLoading(false);
        setError(null);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const [serviceDayRows, reminderRows] = await Promise.all([
          getServiceDaysByDateRange(user.id, startDate, endDate),
          getRemindersByDateRange(user.id, startDate, endDate),
        ]);

        setServiceDays(serviceDayRows.map(mapServiceDay));
        setReminders(reminderRows.map(mapReminder));
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "No se pudieron cargar días de servicio.";
        setError(message);
        setServiceDays([]);
        setReminders([]);
      } finally {
        setIsLoading(false);
      }
    },
    [user?.id, authLoading],
  );

  const mergeServiceDay = useCallback((day: ServiceDay) => {
    setServiceDays((current) => {
      const next = current.filter((item) => item.id !== day.id && item.serviceDate !== day.serviceDate);
      return [...next, day].sort((a, b) => a.serviceDate.localeCompare(b.serviceDate));
    });
  }, []);

  const mergeReminder = useCallback((reminder: ServiceReminder) => {
    setReminders((current) => {
      const next = current.filter((item) => item.id !== reminder.id);
      return [...next, reminder].sort((a, b) => {
        const dateCompare = a.reminderDate.localeCompare(b.reminderDate);
        return dateCompare !== 0 ? dateCompare : a.time.localeCompare(b.time);
      });
    });
  }, []);

  const createServiceDay = useCallback(
    async (params: {
      serviceDate: string;
      notes?: string | null;
      isServiceDay?: boolean;
    }) => {
      if (!user?.id) throw new Error("Usuario no autenticado");

      const row = await createServiceDayInDb({
        userId: user.id,
        serviceDate: params.serviceDate,
        notes: params.notes,
        isServiceDay: params.isServiceDay,
      });
      const day = mapServiceDay(row);
      mergeServiceDay(day);
      setError(null);
      return day;
    },
    [mergeServiceDay, user?.id],
  );

  const updateServiceDay = useCallback(
    async (params: {
      serviceDayId: string;
      serviceDate?: string;
      notes?: string | null;
      isServiceDay?: boolean;
    }) => {
      const row = await updateServiceDayInDb(params);
      const day = mapServiceDay(row);
      mergeServiceDay(day);
      setError(null);
      return day;
    },
    [mergeServiceDay],
  );

  const deleteServiceDay = useCallback(async (serviceDayId: string) => {
    await deleteServiceDayInDb(serviceDayId);
    setServiceDays((current) => current.filter((day) => day.id !== serviceDayId));
    setReminders((current) => current.filter((reminder) => reminder.serviceDayId !== serviceDayId));
    setError(null);
  }, []);

  const createReminder = useCallback(
    async (params: {
      serviceDayId?: string | null;
      reminderDate: string;
      time: string;
      title: string;
      description?: string | null;
      isCompleted?: boolean;
    }) => {
      if (!user?.id) throw new Error("Usuario no autenticado");

      const row = await createReminderInDb({
        userId: user.id,
        ...params,
      });
      const reminder = mapReminder(row);
      mergeReminder(reminder);
      setError(null);
      return reminder;
    },
    [mergeReminder, user?.id],
  );

  const updateReminder = useCallback(
    async (params: {
      reminderId: string;
      serviceDayId?: string | null;
      reminderDate?: string;
      time?: string;
      title?: string;
      description?: string | null;
      isCompleted?: boolean;
    }) => {
      const row = await updateReminderInDb(params);
      const reminder = mapReminder(row);
      mergeReminder(reminder);
      setError(null);
      return reminder;
    },
    [mergeReminder],
  );

  const deleteReminder = useCallback(async (reminderId: string) => {
    await deleteReminderInDb(reminderId);
    setReminders((current) => current.filter((reminder) => reminder.id !== reminderId));
    setError(null);
  }, []);

  const toggleReminderCompleted = useCallback(
    async (reminderId: string, isCompleted: boolean) => {
      const row = await toggleReminderInDb(reminderId, isCompleted);
      const reminder = mapReminder(row);
      mergeReminder(reminder);
      setError(null);
      return reminder;
    },
    [mergeReminder],
  );

  const value = useMemo(
    () => ({
      serviceDays,
      reminders,
      serviceDaysByDate,
      remindersByDate,
      isLoading,
      error,
      loadForRange,
      createServiceDay,
      updateServiceDay,
      deleteServiceDay,
      createReminder,
      updateReminder,
      deleteReminder,
      toggleReminderCompleted,
    }),
    [
      serviceDays,
      reminders,
      serviceDaysByDate,
      remindersByDate,
      isLoading,
      error,
      loadForRange,
      createServiceDay,
      updateServiceDay,
      deleteServiceDay,
      createReminder,
      updateReminder,
      deleteReminder,
      toggleReminderCompleted,
    ],
  );

  return <CalendarContext.Provider value={value}>{children}</CalendarContext.Provider>;
}

export function useCalendar() {
  const context = useContext(CalendarContext);
  if (!context) {
    throw new Error("useCalendar debe usarse dentro de CalendarProvider");
  }
  return context;
}

export function formatDateKey(date: Date): string {
  return format(date, "yyyy-MM-dd");
}
