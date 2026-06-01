import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useAuth } from "@/context/AuthContext";
import {
  createCategory as createCategoryInDb,
  deleteCategory as deleteCategoryInDb,
  getCategories,
  mapCategory,
  updateCategory as updateCategoryInDb,
} from "@/services/categoriesService";
import {
  createMedicalTopic,
  deleteMedicalTopic,
  getMedicalTopics,
  mapMedicalTopic,
  updateMedicalTopic,
} from "@/services/topicsService";
import type {
  CategoryFormValues,
  MedicalTopic,
  TopicCategory,
  TopicFormValues,
} from "@/types/medicalTopic";

interface TopicsContextValue {
  topics: MedicalTopic[];
  categories: TopicCategory[];
  isLoading: boolean;
  error: string | null;
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
  const { user, isLoading: authLoading } = useAuth();
  const [categories, setCategories] = useState<TopicCategory[]>([]);
  const [topics, setTopics] = useState<MedicalTopic[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;

    if (!user?.id) {
      setCategories([]);
      setTopics([]);
      setIsLoading(false);
      setError(null);
      return;
    }

    let cancelled = false;

    async function loadData() {
      setIsLoading(true);
      setError(null);

      try {
        const [categoryRows, topicRows] = await Promise.all([
          getCategories(user.id),
          getMedicalTopics(user.id),
        ]);

        if (cancelled) return;

        setCategories(categoryRows.map(mapCategory));
        setTopics(topicRows.map(mapMedicalTopic));
      } catch (err) {
        if (cancelled) return;
        const message =
          err instanceof Error ? err.message : "No se pudieron cargar temas y categorías.";
        setError(message);
        setCategories([]);
        setTopics([]);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    void loadData();

    return () => {
      cancelled = true;
    };
  }, [user?.id, authLoading]);

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
      if (!user?.id) {
        setError("Debes iniciar sesión para crear temas.");
        throw new Error("Usuario no autenticado");
      }

      void (async () => {
        try {
          const row = await createMedicalTopic({
            userId: user.id,
            title: values.title,
            content: values.content,
            categoryId: values.categoryId,
            presentationDate: values.presentationDate,
          });
          const topic = mapMedicalTopic(row);
          setTopics((current) =>
            [...current, topic].sort((a, b) =>
              a.presentationDate.localeCompare(b.presentationDate),
            ),
          );
          setError(null);
        } catch (err) {
          const message = err instanceof Error ? err.message : "No se pudo crear el tema.";
          setError(message);
        }
      })();

      return {
        id: "",
        title: values.title.trim(),
        content: values.content.trim(),
        categoryId: values.categoryId,
        presentationDate: values.presentationDate,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    },
    [user?.id],
  );

  const updateTopic = useCallback(
    (id: string, values: TopicFormValues) => {
      void (async () => {
        try {
          const row = await updateMedicalTopic({
            topicId: id,
            title: values.title,
            content: values.content,
            categoryId: values.categoryId,
            presentationDate: values.presentationDate,
          });
          const topic = mapMedicalTopic(row);
          setTopics((current) =>
            current
              .map((item) => (item.id === id ? topic : item))
              .sort((a, b) => a.presentationDate.localeCompare(b.presentationDate)),
          );
          setError(null);
        } catch (err) {
          const message = err instanceof Error ? err.message : "No se pudo actualizar el tema.";
          setError(message);
        }
      })();
    },
    [],
  );

  const deleteTopic = useCallback((id: string) => {
    void (async () => {
      try {
        await deleteMedicalTopic(id);
        setTopics((current) => current.filter((topic) => topic.id !== id));
        setError(null);
      } catch (err) {
        const message = err instanceof Error ? err.message : "No se pudo eliminar el tema.";
        setError(message);
      }
    })();
  }, []);

  const getTopicById = useCallback((id: string) => topics.find((t) => t.id === id), [topics]);

  const addCategory = useCallback(
    (values: CategoryFormValues) => {
      if (!user?.id) {
        setError("Debes iniciar sesión para crear categorías.");
        throw new Error("Usuario no autenticado");
      }

      void (async () => {
        try {
          const row = await createCategoryInDb(user.id, values.name);
          const category = mapCategory(row);
          setCategories((current) =>
            [...current, category].sort((a, b) => a.name.localeCompare(b.name)),
          );
          setError(null);
        } catch (err) {
          const message = err instanceof Error ? err.message : "No se pudo crear la categoría.";
          setError(message);
        }
      })();

      return {
        id: "",
        name: values.name.trim(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    },
    [user?.id],
  );

  const updateCategory = useCallback((id: string, values: CategoryFormValues) => {
    void (async () => {
      try {
        const row = await updateCategoryInDb(id, values.name);
        const category = mapCategory(row);
        setCategories((current) =>
          current
            .map((item) => (item.id === id ? category : item))
            .sort((a, b) => a.name.localeCompare(b.name)),
        );
        setError(null);
      } catch (err) {
        const message = err instanceof Error ? err.message : "No se pudo actualizar la categoría.";
        setError(message);
      }
    })();
  }, []);

  const deleteCategory = useCallback(
    (id: string) => {
      const inUse = topics.some((t) => t.categoryId === id);
      if (inUse) {
        return {
          ok: false,
          error: "No puedes eliminar una categoría que tiene temas asignados.",
        };
      }

      void (async () => {
        try {
          await deleteCategoryInDb(id);
          setCategories((current) => current.filter((category) => category.id !== id));
          setError(null);
        } catch (err) {
          const message = err instanceof Error ? err.message : "No se pudo eliminar la categoría.";
          setError(message);
        }
      })();

      return { ok: true };
    },
    [topics],
  );

  const value = useMemo(
    () => ({
      topics,
      categories,
      isLoading,
      error,
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
      isLoading,
      error,
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
