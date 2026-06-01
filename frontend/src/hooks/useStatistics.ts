import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useTopics } from "@/context/TopicsContext";
import { computeStatistics, type StatisticsData } from "@/lib/statistics";
import { getReminders } from "@/services/remindersService";
import { getServiceDays } from "@/services/serviceDaysService";
import { mapReminder } from "@/types/reminder";
import { mapServiceDay } from "@/types/serviceDay";
import type { ServiceReminder } from "@/types/reminder";
import type { ServiceDay } from "@/types/serviceDay";

const emptyStats: StatisticsData = {
  totalTopics: 0,
  totalCategories: 0,
  totalServiceDays: 0,
  serviceDaysWithTopics: 0,
  serviceDaysWithoutTopics: 0,
  organizationPercent: 0,
  topicsByCategory: [],
  topicsByMonth: [],
  remindersTotal: 0,
  remindersCompleted: 0,
  remindersPending: 0,
  serviceDaysWithNotes: 0,
  averageTopicsPerServiceDay: 0,
};

export function useStatistics() {
  const { user, isLoading: authLoading } = useAuth();
  const { topics, categories, getCategoryName, isLoading: topicsLoading } = useTopics();
  const [serviceDays, setServiceDays] = useState<ServiceDay[]>([]);
  const [reminders, setReminders] = useState<ServiceReminder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;

    if (!user?.id) {
      setServiceDays([]);
      setReminders([]);
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    async function load() {
      setIsLoading(true);
      setError(null);

      try {
        const [serviceDayRows, reminderRows] = await Promise.all([
          getServiceDays(user.id),
          getReminders(user.id),
        ]);

        if (cancelled) return;

        setServiceDays(serviceDayRows.map(mapServiceDay));
        setReminders(reminderRows.map(mapReminder));
      } catch (err) {
        if (cancelled) return;
        const message =
          err instanceof Error ? err.message : "No se pudieron cargar las estadísticas.";
        setError(message);
        setServiceDays([]);
        setReminders([]);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [user?.id, authLoading]);

  const stats = useMemo(
    () =>
      topicsLoading || isLoading
        ? emptyStats
        : computeStatistics(topics, categories, serviceDays, reminders, getCategoryName),
    [topics, categories, serviceDays, reminders, getCategoryName, topicsLoading, isLoading],
  );

  return {
    stats,
    isLoading: authLoading || topicsLoading || isLoading,
    error,
  };
}
