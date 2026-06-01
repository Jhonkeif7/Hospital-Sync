import { supabase } from "../lib/supabaseClient";
import { mapServiceDay, type ServiceDay, type ServiceDayRow } from "@/types/serviceDay";

export { mapServiceDay };

export async function getServiceDays(userId: string) {
  const { data, error } = await supabase
    .from("service_days")
    .select("*")
    .eq("user_id", userId)
    .order("service_date", { ascending: true });

  if (error) throw error;

  return (data ?? []) as ServiceDayRow[];
}

export async function getServiceDaysByDateRange(
  userId: string,
  startDate: string,
  endDate: string,
) {
  const { data, error } = await supabase
    .from("service_days")
    .select("*")
    .eq("user_id", userId)
    .gte("service_date", startDate)
    .lte("service_date", endDate)
    .order("service_date", { ascending: true });

  if (error) throw error;

  return (data ?? []) as ServiceDayRow[];
}

export async function createServiceDay(params: {
  userId: string;
  serviceDate: string;
  notes?: string | null;
  isServiceDay?: boolean;
}) {
  const { data, error } = await supabase
    .from("service_days")
    .insert({
      user_id: params.userId,
      service_date: params.serviceDate,
      notes: params.notes?.trim() || null,
      is_service_day: params.isServiceDay ?? true,
    })
    .select()
    .single();

  if (error) throw error;

  return data as ServiceDayRow;
}

export async function updateServiceDay(params: {
  serviceDayId: string;
  serviceDate?: string;
  notes?: string | null;
  isServiceDay?: boolean;
}) {
  const payload: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (params.serviceDate !== undefined) payload.service_date = params.serviceDate;
  if (params.notes !== undefined) payload.notes = params.notes?.trim() || null;
  if (params.isServiceDay !== undefined) payload.is_service_day = params.isServiceDay;

  const { data, error } = await supabase
    .from("service_days")
    .update(payload)
    .eq("id", params.serviceDayId)
    .select()
    .single();

  if (error) throw error;

  return data as ServiceDayRow;
}

export async function deleteServiceDay(serviceDayId: string) {
  const { error } = await supabase.from("service_days").delete().eq("id", serviceDayId);

  if (error) throw error;
}

export type { ServiceDay };
