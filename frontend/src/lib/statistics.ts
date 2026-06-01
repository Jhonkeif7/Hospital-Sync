import { addDays, format, max as maxDate, parseISO, startOfDay } from "date-fns";
import { es } from "date-fns/locale";
import { SERVICE_INTERVAL_DAYS, getServiceAnchor, isServiceDay } from "@/data/mockServiceDays";
import type { ServiceReminder } from "@/types/reminder";
import type { ServiceDay } from "@/types/serviceDay";
import type { MedicalTopic } from "@/types/medicalTopic";

export interface CategoryStat {
  id: string;
  name: string;
  count: number;
}

export interface MonthStat {
  key: string;
  label: string;
  count: number;
}

export interface StatisticsData {
  totalTopics: number;
  totalCategories: number;
  totalServiceDays: number;
  serviceDaysWithTopics: number;
  serviceDaysWithoutTopics: number;
  organizationPercent: number;
  topicsByCategory: CategoryStat[];
  topicsByMonth: MonthStat[];
  remindersTotal: number;
  remindersCompleted: number;
  remindersPending: number;
  serviceDaysWithNotes: number;
  averageTopicsPerServiceDay: number;
}

function collectServiceDatesInRange(
  rangeStart: Date,
  rangeEnd: Date,
  serviceDays: ServiceDay[],
): Set<string> {
  const dates = new Set<string>();
  const anchor = getServiceAnchor();

  for (const day of eachDayInRange(rangeStart, rangeEnd)) {
    const key = format(day, "yyyy-MM-dd");
    const dbDay = serviceDays.find((item) => item.serviceDate === key);

    if (dbDay) {
      if (dbDay.isServiceDay) dates.add(key);
    } else if (isServiceDay(day, anchor)) {
      dates.add(key);
    }
  }

  return dates;
}

function eachDayInRange(start: Date, end: Date): Date[] {
  const days: Date[] = [];
  let current = startOfDay(start);
  const last = startOfDay(end);

  while (current <= last) {
    days.push(current);
    current = addDays(current, 1);
  }

  return days;
}

function resolveStatsRange(
  topics: MedicalTopic[],
  serviceDays: ServiceDay[],
): { start: Date; end: Date } {
  const anchor = getServiceAnchor();
  const start = anchor;
  const candidates = [
    startOfDay(new Date()),
    addDays(startOfDay(new Date()), SERVICE_INTERVAL_DAYS * 20),
    ...topics.map((topic) => startOfDay(parseISO(topic.presentationDate))),
    ...serviceDays.map((day) => startOfDay(parseISO(day.serviceDate))),
  ];

  const end = candidates.reduce((latest, date) => maxDate([latest, date]), start);
  return { start, end };
}

export function computeStatistics(
  topics: MedicalTopic[],
  categories: { id: string; name: string }[],
  serviceDays: ServiceDay[],
  reminders: ServiceReminder[],
  getCategoryName: (id: string) => string,
): StatisticsData {
  const { start, end } = resolveStatsRange(topics, serviceDays);
  const serviceDateKeys = collectServiceDatesInRange(start, end, serviceDays);

  const topicsByDate = topics.reduce<Record<string, number>>((acc, topic) => {
    acc[topic.presentationDate] = (acc[topic.presentationDate] ?? 0) + 1;
    return acc;
  }, {});

  let serviceDaysWithTopics = 0;
  for (const dateKey of serviceDateKeys) {
    if ((topicsByDate[dateKey] ?? 0) > 0) serviceDaysWithTopics += 1;
  }

  const totalServiceDays = serviceDateKeys.size;
  const serviceDaysWithoutTopics = Math.max(0, totalServiceDays - serviceDaysWithTopics);
  const organizationPercent =
    totalServiceDays === 0
      ? 0
      : Math.round((serviceDaysWithTopics / totalServiceDays) * 100);

  const categoryCounts = new Map<string, number>();
  for (const topic of topics) {
    categoryCounts.set(topic.categoryId, (categoryCounts.get(topic.categoryId) ?? 0) + 1);
  }

  const topicsByCategory: CategoryStat[] = [...categoryCounts.entries()]
    .map(([id, count]) => ({
      id,
      name: getCategoryName(id),
      count,
    }))
    .sort((a, b) => b.count - a.count);

  const monthCounts = new Map<string, number>();
  for (const topic of topics) {
    const monthKey = topic.presentationDate.slice(0, 7);
    monthCounts.set(monthKey, (monthCounts.get(monthKey) ?? 0) + 1);
  }

  const topicsByMonth: MonthStat[] = [...monthCounts.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, count]) => ({
      key,
      label: format(parseISO(`${key}-01`), "MMM yyyy", { locale: es }),
      count,
    }));

  const remindersCompleted = reminders.filter((item) => item.isCompleted).length;
  const remindersPending = reminders.length - remindersCompleted;

  const serviceDaysWithNotes = serviceDays.filter(
    (day) => day.isServiceDay && Boolean(day.notes?.trim()),
  ).length;

  const totalTopicsOnServiceDays = [...serviceDateKeys].reduce(
    (sum, dateKey) => sum + (topicsByDate[dateKey] ?? 0),
    0,
  );

  const averageTopicsPerServiceDay =
    totalServiceDays === 0
      ? 0
      : Math.round((totalTopicsOnServiceDays / totalServiceDays) * 10) / 10;

  return {
    totalTopics: topics.length,
    totalCategories: categories.length,
    totalServiceDays,
    serviceDaysWithTopics,
    serviceDaysWithoutTopics,
    organizationPercent,
    topicsByCategory,
    topicsByMonth,
    remindersTotal: reminders.length,
    remindersCompleted,
    remindersPending,
    serviceDaysWithNotes,
    averageTopicsPerServiceDay,
  };
}
