import type { LucideIcon } from "lucide-react";
import type { CalendarTopicDisplay } from "@/types/medicalTopic";

export type { CalendarTopicDisplay };

export interface Reminder {
  id: string;
  time: string;
  title: string;
  description?: string;
  isCompleted?: boolean;
  serviceDayId?: string | null;
  reminderDate?: string;
}

export interface CalendarDay {
  date: Date;
  isServiceDay: boolean;
  isInRange: boolean;
  topics: CalendarTopicDisplay[];
  notes?: string;
  reminders: Reminder[];
  serviceDayId?: string;
  /** Día resaltado por búsqueda de temas */
  isSearchHighlighted?: boolean;
}

export type PeriodFilter = "5-weeks" | "10-weeks" | "20-weeks";
export type TopicDateFilter = "all" | "this-week" | "custom";
export type ServiceFilter = "all" | "service-only";

export interface CalendarFiltersState {
  period: PeriodFilter;
  topicDateFilter: TopicDateFilter;
  customDateFrom: string;
  customDateTo: string;
  serviceFilter: ServiceFilter;
  searchQuery: string;
}

export interface CalendarStats {
  serviceDays: number;
  weeks: number;
  topicsCount: number;
  organizationPercent: number;
}

export interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  path: string;
}
