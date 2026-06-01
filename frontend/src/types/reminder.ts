export interface ServiceReminder {
  id: string;
  userId: string;
  serviceDayId: string | null;
  reminderDate: string;
  time: string;
  title: string;
  description: string | null;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ReminderRow {
  id: string;
  user_id: string;
  service_day_id: string | null;
  reminder_date: string;
  time: string;
  title: string;
  description: string | null;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
}

function normalizeTime(value: string): string {
  return value.length >= 5 ? value.slice(0, 5) : value;
}

export function mapReminder(row: ReminderRow): ServiceReminder {
  return {
    id: row.id,
    userId: row.user_id,
    serviceDayId: row.service_day_id,
    reminderDate: row.reminder_date,
    time: normalizeTime(row.time),
    title: row.title,
    description: row.description,
    isCompleted: row.is_completed,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
