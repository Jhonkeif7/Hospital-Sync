import { useEffect, useMemo, useState } from "react";
import { useTopics } from "@/context/TopicsContext";
import { filterTopicsList } from "@/lib/topicFilters";
import type { MedicalTopic, TopicFormValues } from "@/types/medicalTopic";
import { PageShell } from "@/components/layout/PageShell";
import { DeleteTopicDialog } from "@/components/topics/DeleteTopicDialog";
import { TopicFormDialog } from "@/components/topics/TopicFormDialog";
import { TopicList } from "@/components/topics/TopicList";
import { TOPICS_PAGE_SIZE, TopicsPagination } from "@/components/topics/TopicsPagination";
import { TopicsFiltersBar, type TopicsListFilters } from "@/components/topics/TopicsFiltersBar";
import { TopicsToolbar } from "@/components/topics/TopicsToolbar";

const defaultListFilters: TopicsListFilters = {
  searchQuery: "",
  categoryId: "all",
  dateFrom: "",
  dateTo: "",
};

export function TopicsPage() {
  const { topics, addTopic, updateTopic, deleteTopic } = useTopics();
  const [listFilters, setListFilters] = useState<TopicsListFilters>(defaultListFilters);
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [editingTopic, setEditingTopic] = useState<MedicalTopic | undefined>();
  const [deletingTopic, setDeletingTopic] = useState<MedicalTopic | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredTopics = useMemo(
    () =>
      filterTopicsList(topics, {
        searchQuery: listFilters.searchQuery,
        categoryId: listFilters.categoryId,
        presentationFrom: listFilters.dateFrom || undefined,
        presentationTo: listFilters.dateTo || undefined,
      }),
    [topics, listFilters],
  );

  const totalPages = Math.max(1, Math.ceil(filteredTopics.length / TOPICS_PAGE_SIZE));

  const paginatedTopics = useMemo(() => {
    const start = (currentPage - 1) * TOPICS_PAGE_SIZE;
    return filteredTopics.slice(start, start + TOPICS_PAGE_SIZE);
  }, [filteredTopics, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [listFilters.searchQuery, listFilters.categoryId, listFilters.dateFrom, listFilters.dateTo]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const openCreate = () => {
    setFormMode("create");
    setEditingTopic(undefined);
    setFormOpen(true);
  };

  const openEdit = (topic: MedicalTopic) => {
    setFormMode("edit");
    setEditingTopic(topic);
    setFormOpen(true);
  };

  const handleFormSubmit = (values: TopicFormValues) => {
    if (formMode === "create") {
      addTopic(values);
      return;
    }
    if (editingTopic) {
      updateTopic(editingTopic.id, values);
    }
  };

  const updateListFilters = (partial: Partial<TopicsListFilters>) => {
    setListFilters((current) => ({ ...current, ...partial }));
  };

  return (
    <PageShell
      header={
        <>
          <TopicsToolbar
            topicCount={filteredTopics.length}
            totalCount={topics.length}
            onAddClick={openCreate}
          />
          <TopicsFiltersBar filters={listFilters} onFiltersChange={updateListFilters} />
        </>
      }
    >
      <div className="p-4 sm:p-6">
        <TopicList
          topics={paginatedTopics}
          onEdit={openEdit}
          onDelete={(topic) => setDeletingTopic(topic)}
        />
        <TopicsPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredTopics.length}
          onPageChange={setCurrentPage}
        />
      </div>

      <TopicFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        mode={formMode}
        topic={editingTopic}
        onSubmit={handleFormSubmit}
      />

      <DeleteTopicDialog
        topic={deletingTopic}
        open={Boolean(deletingTopic)}
        onOpenChange={(open) => !open && setDeletingTopic(null)}
        onConfirm={() => deletingTopic && deleteTopic(deletingTopic.id)}
      />
    </PageShell>
  );
}
