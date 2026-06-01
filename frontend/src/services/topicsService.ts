import { supabase } from "../lib/supabaseClient";
import type { MedicalTopic } from "@/types/medicalTopic";

export interface MedicalTopicRow {
  id: string;
  user_id: string;
  title: string;
  content: string | null;
  category_id: string | null;
  presentation_date: string | null;
  created_at: string;
  updated_at: string;
  topic_categories?: { id: string; name: string } | null;
}

export function mapMedicalTopic(row: MedicalTopicRow): MedicalTopic {
  return {
    id: row.id,
    title: row.title,
    content: row.content ?? "",
    categoryId: row.category_id ?? "",
    presentationDate: row.presentation_date ?? "",
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getMedicalTopics(userId: string) {
  const { data, error } = await supabase
    .from("medical_topics")
    .select(`
      *,
      topic_categories (
        id,
        name
      )
    `)
    .eq("user_id", userId)
    .order("presentation_date", { ascending: true });

  if (error) throw error;

  return (data ?? []) as MedicalTopicRow[];
}

export async function createMedicalTopic(params: {
  userId: string;
  title: string;
  content?: string;
  categoryId?: string | null;
  presentationDate?: string | null;
}) {
  const { data, error } = await supabase
    .from("medical_topics")
    .insert({
      user_id: params.userId,
      title: params.title.trim(),
      content: params.content?.trim() || null,
      category_id: params.categoryId || null,
      presentation_date: params.presentationDate || null,
    })
    .select()
    .single();

  if (error) throw error;

  return data as MedicalTopicRow;
}

export async function updateMedicalTopic(params: {
  topicId: string;
  title: string;
  content?: string;
  categoryId?: string | null;
  presentationDate?: string | null;
}) {
  const { data, error } = await supabase
    .from("medical_topics")
    .update({
      title: params.title.trim(),
      content: params.content?.trim() || null,
      category_id: params.categoryId || null,
      presentation_date: params.presentationDate || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", params.topicId)
    .select()
    .single();

  if (error) throw error;

  return data as MedicalTopicRow;
}

export async function deleteMedicalTopic(topicId: string) {
  const { error } = await supabase.from("medical_topics").delete().eq("id", topicId);

  if (error) throw error;
}
