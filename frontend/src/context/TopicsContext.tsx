import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type {
  CategoryFormValues,
  MedicalTopic,
  TopicCategory,
  TopicFormValues,
} from "@/types/medicalTopic";

const TOPICS_KEY = "hospital-sync-topics";
const TOPICS_VERSION_KEY = "hospital-sync-topics-version";
const CATEGORIES_KEY = "hospital-sync-categories";
/** Incrementar cuando cambien los datos por defecto para fusionarlos en localStorage */
const TOPICS_STORAGE_VERSION = 2;

const defaultCategories: TopicCategory[] = [
  { id: "cat-neumo", name: "Neumología", createdAt: "", updatedAt: "" },
  { id: "cat-cardio", name: "Cardiología", createdAt: "", updatedAt: "" },
  { id: "cat-casos", name: "Casos clínicos", createdAt: "", updatedAt: "" },
  { id: "cat-urg", name: "Urgencias", createdAt: "", updatedAt: "" },
  { id: "cat-proc", name: "Procedimientos", createdAt: "", updatedAt: "" },
  { id: "cat-endo", name: "Endocrinología", createdAt: "", updatedAt: "" },
  { id: "cat-nefro", name: "Nefrología", createdAt: "", updatedAt: "" },
].map((c) => ({
  ...c,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}));

const defaultTopics: MedicalTopic[] = [
  {
    id: "topic-1",
    title: "Neumonía adquirida en la comunidad",
    content:
      "Criterios de ingreso, escalas de gravedad (CURB-65, PSI) y esquema antibiótico empírico según guía local.",
    categoryId: "cat-neumo",
    presentationDate: "2026-05-22",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "topic-2",
    title: "Insuficiencia cardíaca descompensada",
    content:
      "Clasificación NYHA, manejo de congestión con diuréticos y criterios de monitorización en planta.",
    categoryId: "cat-cardio",
    presentationDate: "2026-05-22",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "topic-3",
    title: "Caso clínico: EPOC",
    content:
      "Apuntes del paciente del servicio: exacerbación, oxigenoterapia, broncodilatadores y plan de alta.",
    categoryId: "cat-casos",
    presentationDate: "2026-05-22",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "topic-4",
    title: "Sepsis y shock séptico",
    content: "Manejo inicial, fluidoterapia y antibióticos de amplio espectro.",
    categoryId: "cat-urg",
    presentationDate: "2026-05-26",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "topic-5",
    title: "Manejo de vía aérea",
    content: "Algoritmo de intubación y ventilación en urgencias.",
    categoryId: "cat-proc",
    presentationDate: "2026-05-26",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "topic-6",
    title: "Diabetes descompensada",
    content: "Criterios de ingreso y manejo de hiperglucemia.",
    categoryId: "cat-endo",
    presentationDate: "2026-05-30",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "topic-7",
    title: "Síndrome coronario agudo",
    content: "ECG, troponinas y tratamiento según guía.",
    categoryId: "cat-cardio",
    presentationDate: "2026-06-03",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "topic-8",
    title: "Insuficiencia renal aguda",
    content: "Balance hídrico, diuresis y criterios de diálisis.",
    categoryId: "cat-nefro",
    presentationDate: "2026-06-07",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

function loadCategories(): TopicCategory[] {
  try {
    const stored = localStorage.getItem(CATEGORIES_KEY);
    if (!stored) return defaultCategories;
    const parsed = JSON.parse(stored) as TopicCategory[];
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : defaultCategories;
  } catch {
    return defaultCategories;
  }
}

function migrateTopic(raw: Record<string, unknown>): MedicalTopic {
  const now = new Date().toISOString();
  return {
    id: String(raw.id ?? createId("topic")),
    title: String(raw.title ?? ""),
    content: String(raw.content ?? ""),
    categoryId: String(raw.categoryId ?? "cat-casos"),
    presentationDate: String(raw.presentationDate ?? formatDate(new Date())),
    createdAt: String(raw.createdAt ?? now),
    updatedAt: String(raw.updatedAt ?? now),
  };
}

function formatDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function mergeWithDefaultTopics(stored: MedicalTopic[]): MedicalTopic[] {
  const existingIds = new Set(stored.map((topic) => topic.id));
  const missingDefaults = defaultTopics.filter((topic) => !existingIds.has(topic.id));
  return missingDefaults.length > 0 ? [...stored, ...missingDefaults] : stored;
}

function loadTopics(): MedicalTopic[] {
  try {
    const storedRaw = localStorage.getItem(TOPICS_KEY);
    const savedVersion = Number(localStorage.getItem(TOPICS_VERSION_KEY) ?? 0);

    if (!storedRaw) {
      saveTopics(defaultTopics);
      localStorage.setItem(TOPICS_VERSION_KEY, String(TOPICS_STORAGE_VERSION));
      return defaultTopics;
    }

    const parsed = JSON.parse(storedRaw) as Record<string, unknown>[];
    if (!Array.isArray(parsed) || parsed.length === 0) {
      saveTopics(defaultTopics);
      localStorage.setItem(TOPICS_VERSION_KEY, String(TOPICS_STORAGE_VERSION));
      return defaultTopics;
    }

    let topics = parsed.map(migrateTopic);

    if (savedVersion < TOPICS_STORAGE_VERSION) {
      topics = mergeWithDefaultTopics(topics);
      saveTopics(topics);
      localStorage.setItem(TOPICS_VERSION_KEY, String(TOPICS_STORAGE_VERSION));
    }

    return topics;
  } catch {
    return defaultTopics;
  }
}

function saveTopics(topics: MedicalTopic[]) {
  localStorage.setItem(TOPICS_KEY, JSON.stringify(topics));
}

function saveCategories(categories: TopicCategory[]) {
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
}

function createId(prefix: string) {
  return `${prefix}-${crypto.randomUUID()}`;
}

interface TopicsContextValue {
  topics: MedicalTopic[];
  categories: TopicCategory[];
  addTopic: (values: TopicFormValues) => MedicalTopic;
  updateTopic: (id: string, values: TopicFormValues) => void;
  deleteTopic: (id: string) => void;
  getTopicById: (id: string) => MedicalTopic | undefined;
  addCategory: (values: CategoryFormValues) => TopicCategory;
  updateCategory: (id: string, values: CategoryFormValues) => void;
  deleteCategory: (id: string) => { ok: boolean; error?: string };
  getCategoryById: (id: string) => TopicCategory | undefined;
  getCategoryName: (id: string) => string;
}

const TopicsContext = createContext<TopicsContextValue | null>(null);

export function TopicsProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<TopicCategory[]>(loadCategories);
  const [topics, setTopics] = useState<MedicalTopic[]>(loadTopics);

  const persistTopics = useCallback((next: MedicalTopic[]) => {
    setTopics(next);
    saveTopics(next);
  }, []);

  const persistCategories = useCallback((next: TopicCategory[]) => {
    setCategories(next);
    saveCategories(next);
  }, []);

  const getCategoryById = useCallback(
    (id: string) => categories.find((c) => c.id === id),
    [categories],
  );

  const getCategoryName = useCallback(
    (id: string) => getCategoryById(id)?.name ?? "Sin categoría",
    [getCategoryById],
  );

  const addTopic = useCallback(
    (values: TopicFormValues) => {
      const now = new Date().toISOString();
      const topic: MedicalTopic = {
        id: createId("topic"),
        title: values.title.trim(),
        content: values.content.trim(),
        categoryId: values.categoryId,
        presentationDate: values.presentationDate,
        createdAt: now,
        updatedAt: now,
      };
      persistTopics([topic, ...topics]);
      return topic;
    },
    [persistTopics, topics],
  );

  const updateTopic = useCallback(
    (id: string, values: TopicFormValues) => {
      const now = new Date().toISOString();
      persistTopics(
        topics.map((topic) =>
          topic.id === id
            ? {
                ...topic,
                title: values.title.trim(),
                content: values.content.trim(),
                categoryId: values.categoryId,
                presentationDate: values.presentationDate,
                updatedAt: now,
              }
            : topic,
        ),
      );
    },
    [persistTopics, topics],
  );

  const deleteTopic = useCallback(
    (id: string) => {
      persistTopics(topics.filter((topic) => topic.id !== id));
    },
    [persistTopics, topics],
  );

  const getTopicById = useCallback((id: string) => topics.find((t) => t.id === id), [topics]);

  const addCategory = useCallback(
    (values: CategoryFormValues) => {
      const now = new Date().toISOString();
      const category: TopicCategory = {
        id: createId("cat"),
        name: values.name.trim(),
        createdAt: now,
        updatedAt: now,
      };
      persistCategories([...categories, category]);
      return category;
    },
    [categories, persistCategories],
  );

  const updateCategory = useCallback(
    (id: string, values: CategoryFormValues) => {
      const now = new Date().toISOString();
      persistCategories(
        categories.map((cat) =>
          cat.id === id ? { ...cat, name: values.name.trim(), updatedAt: now } : cat,
        ),
      );
    },
    [categories, persistCategories],
  );

  const deleteCategory = useCallback(
    (id: string) => {
      const inUse = topics.some((t) => t.categoryId === id);
      if (inUse) {
        return {
          ok: false,
          error: "No puedes eliminar una categoría que tiene temas asignados.",
        };
      }
      persistCategories(categories.filter((c) => c.id !== id));
      return { ok: true };
    },
    [categories, persistCategories, topics],
  );

  const value = useMemo(
    () => ({
      topics,
      categories,
      addTopic,
      updateTopic,
      deleteTopic,
      getTopicById,
      addCategory,
      updateCategory,
      deleteCategory,
      getCategoryById,
      getCategoryName,
    }),
    [
      topics,
      categories,
      addTopic,
      updateTopic,
      deleteTopic,
      getTopicById,
      addCategory,
      updateCategory,
      deleteCategory,
      getCategoryById,
      getCategoryName,
    ],
  );

  return <TopicsContext.Provider value={value}>{children}</TopicsContext.Provider>;
}

export function useTopics() {
  const context = useContext(TopicsContext);
  if (!context) {
    throw new Error("useTopics debe usarse dentro de TopicsProvider");
  }
  return context;
}
