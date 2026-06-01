import { supabase } from "../lib/supabaseClient";
import { mapReminder, type ReminderRow, type ServiceReminder } from "@/types/reminder";

export { mapReminder };

export async function getReminders(userId: string) {
  const { data, error } = await supabase
    .from("reminders")
    .select("*")
    .eq("user_id", userId)
    .order("reminder_date", { ascending: true })
    .order("time", { ascending: true });

  if (error) throw error;

  return (data ?? []) as ReminderRow[];
}

export async function getRemindersByDateRange(
  userId: string,
  startDate: string,
  endDate: string,
) {
  const { data, error } = await supabase
    .from("reminders")
    .select("*")
    .eq("user_id", userId)
    .gte("reminder_date", startDate)
    .lte("reminder_date", endDate)
    .order("reminder_date", { ascending: true })
    .order("time", { ascending: true });

  if (error) throw error;

  return (data ?? []) as ReminderRow[];
}

export async function createReminder(params: {
  userId: string;
  serviceDayId?: string | null;
  reminderDate: string;
  time: string;
  title: string;
  description?: string | null;
  isCompleted?: boolean;
}) {
  const { data, error } = await supabase
    .from("reminders")
    .insert({
      user_id: params.userId,
      service_day_id: params.serviceDayId || null,
      reminder_date: params.reminderDate,
      time: params.time,
      title: params.title.trim(),
      description: params.description?.trim() || null,
      is_completed: params.isCompleted ?? false,
    })
    .select()
    .single();

  if (error) throw error;

  return data as ReminderRow;
}

export async function updateReminder(params: {
  reminderId: string;
  serviceDayId?: string | null;
  reminderDate?: string;
  time?: string;
  title?: string;
  description?: string | null;
  isCompleted?: boolean;
}) {
  const payload: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (params.serviceDayId !== undefined) payload.service_day_id = params.serviceDayId;
  if (params.reminderDate !== undefined) payload.reminder_date = params.reminderDate;
  if (params.time !== undefined) payload.time = params.time;
  if (params.title !== undefined) payload.title = params.title.trim();
  if (params.description !== undefined) payload.description = params.description?.trim() || null;
  if (params.isCompleted !== undefined) payload.is_completed = params.isCompleted;

  const { data, error } = await supabase
    .from("reminders")
    .update(payload)
    .eq("id", params.reminderId)
    .select()
    .single();

  if (error) throw error;

  return data as ReminderRow;
}

export async function deleteReminder(reminderId: string) {
  const { error } = await supabase.from("reminders").delete().eq("id", reminderId);

  if (error) throw error;
}

export async function toggleReminderCompleted(reminderId: string, isCompleted: boolean) {
  const { data, error } = await supabase
    .from("reminders")
    .update({
      is_completed: isCompleted,
      updated_at: new Date().toISOString(),
    })
    .eq("id", reminderId)
    .select()
    .single();

  if (error) throw error;

  return data as ReminderRow;
}

export type { ServiceReminder };
