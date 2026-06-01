export interface ServiceDay {
  id: string;
  userId: string;
  serviceDate: string;
  notes: string | null;
  isServiceDay: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceDayRow {
  id: string;
  user_id: string;
  service_date: string;
  notes: string | null;
  is_service_day: boolean;
  created_at: string;
  updated_at: string;
}

export function mapServiceDay(row: ServiceDayRow): ServiceDay {
  return {
    id: row.id,
    userId: row.user_id,
    serviceDate: row.service_date,
    notes: row.notes,
    isServiceDay: row.is_service_day,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
