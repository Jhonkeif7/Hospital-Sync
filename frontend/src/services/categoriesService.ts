import { supabase } from "../lib/supabaseClient";
import type { TopicCategory } from "@/types/medicalTopic";

export interface TopicCategoryRow {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export function mapCategory(row: TopicCategoryRow): TopicCategory {
  return {
    id: row.id,
    name: row.name,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getCategories(userId: string) {
  const { data, error } = await supabase
    .from("topic_categories")
    .select("*")
    .eq("user_id", userId)
    .order("name", { ascending: true });

  if (error) throw error;

  return (data ?? []) as TopicCategoryRow[];
}

export async function createCategory(userId: string, name: string) {
  const { data, error } = await supabase
    .from("topic_categories")
    .insert({
      user_id: userId,
      name: name.trim(),
    })
    .select()
    .single();

  if (error) throw error;

  return data as TopicCategoryRow;
}

export async function updateCategory(categoryId: string, name: string) {
  const { data, error } = await supabase
    .from("topic_categories")
    .update({
      name: name.trim(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", categoryId)
    .select()
    .single();

  if (error) throw error;

  return data as TopicCategoryRow;
}

export async function deleteCategory(categoryId: string) {
  const { error } = await supabase.from("topic_categories").delete().eq("id", categoryId);

  if (error) throw error;
}
