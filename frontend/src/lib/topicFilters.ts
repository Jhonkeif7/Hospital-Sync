import {
  endOfWeek,
  isWithinInterval,
  parse,
  startOfDay,
  startOfWeek,
} from "date-fns";
import type { MedicalTopic } from "@/types/medicalTopic";
import type { TopicDateFilter } from "@/types/calendar";

export function parsePresentationDate(dateStr: string): Date {
  return startOfDay(parse(dateStr, "yyyy-MM-dd", new Date()));
}

export function topicMatchesSearch(topic: MedicalTopic, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return false;
  return (
    topic.title.toLowerCase().includes(q) ||
    topic.content.toLowerCase().includes(q)
  );
}

export function topicMatchesDateFilter(
  topic: MedicalTopic,
  filter: TopicDateFilter,
  customFrom?: string,
  customTo?: string,
  referenceDate: Date = new Date(),
): boolean {
  const topicDate = parsePresentationDate(topic.presentationDate);

  if (filter === "all") return true;

  if (filter === "this-week") {
    const weekStart = startOfWeek(referenceDate, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(referenceDate, { weekStartsOn: 1 });
    return isWithinInterval(topicDate, { start: weekStart, end: weekEnd });
  }

  if (filter === "custom" && customFrom && customTo) {
    const from = parsePresentationDate(customFrom);
    const to = parsePresentationDate(customTo);
    return isWithinInterval(topicDate, { start: from, end: to });
  }

  return true;
}

export function filterTopicsList(
  topics: MedicalTopic[],
  options: {
    searchQuery?: string;
    categoryId?: string;
    dateFilter?: TopicDateFilter;
    customDateFrom?: string;
    customDateTo?: string;
    presentationFrom?: string;
    presentationTo?: string;
  },
): MedicalTopic[] {
  return topics.filter((topic) => {
    if (options.categoryId && options.categoryId !== "all") {
      if (topic.categoryId !== options.categoryId) return false;
    }

    if (options.searchQuery?.trim()) {
      if (!topicMatchesSearch(topic, options.searchQuery)) return false;
    }

    if (options.dateFilter && options.dateFilter !== "all") {
      if (
        !topicMatchesDateFilter(
          topic,
          options.dateFilter,
          options.customDateFrom,
          options.customDateTo,
        )
      ) {
        return false;
      }
    }

    if (options.presentationFrom || options.presentationTo) {
      const topicDate = parsePresentationDate(topic.presentationDate);
      if (options.presentationFrom) {
        const from = parsePresentationDate(options.presentationFrom);
        if (topicDate < from) return false;
      }
      if (options.presentationTo) {
        const to = parsePresentationDate(options.presentationTo);
        if (topicDate > to) return false;
      }
    }

    return true;
  });
}
