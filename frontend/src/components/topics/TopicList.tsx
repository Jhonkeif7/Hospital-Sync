import type { MedicalTopic } from "@/types/medicalTopic";
import { TopicCard } from "@/components/topics/TopicCard";
import { TopicsEmptyState } from "@/components/topics/TopicsEmptyState";

interface TopicListProps {
  topics: MedicalTopic[];
  onEdit: (topic: MedicalTopic) => void;
  onDelete: (topic: MedicalTopic) => void;
}

export function TopicList({ topics, onEdit, onDelete }: TopicListProps) {
  if (topics.length === 0) {
    return <TopicsEmptyState />;
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {topics.map((topic) => (
        <TopicCard key={topic.id} topic={topic} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
}
