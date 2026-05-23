/**
 * Modelo canónico de temas médicos — Hospital Sync
 *
 * Usado en:
 * - Mis temas (CRUD, filtros, apuntes)
 * - Calendario / ServiceDays (temas por fecha de exposición)
 * - Panel de detalle del día
 *
 * @see docs/TOPICS.md
 */

export interface TopicCategory {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface MedicalTopic {
  id: string;
  /** Título del tema (obligatorio) */
  title: string;
  /** Apuntes y contenido del tema */
  content: string;
  /** ID de categoría (obligatorio) */
  categoryId: string;
  /** Fecha de exposición en servicio — formato yyyy-MM-dd (obligatorio) */
  presentationDate: string;
  createdAt: string;
  updatedAt: string;
}

export type TopicFormValues = Pick<
  MedicalTopic,
  "title" | "content" | "categoryId" | "presentationDate"
>;

export type CategoryFormValues = Pick<TopicCategory, "name">;

/** Referencia mínima en celdas del calendario */
export type CalendarTopicDisplay = Pick<
  MedicalTopic,
  "id" | "title" | "categoryId" | "presentationDate"
> & {
  categoryName: string;
};
