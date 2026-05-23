import { Pencil, Trash2 } from "lucide-react";
import { format, parse } from "date-fns";
import { es } from "date-fns/locale";
import { useTopics } from "@/context/TopicsContext";
import type { MedicalTopic } from "@/types/medicalTopic";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TopicCardProps {
  topic: MedicalTopic;
  onEdit: (topic: MedicalTopic) => void;
  onDelete: (topic: MedicalTopic) => void;
}

export function TopicCard({ topic, onEdit, onDelete }: TopicCardProps) {
  const { getCategoryName } = useTopics();
  const updatedLabel = format(new Date(topic.updatedAt), "d MMM yyyy", { locale: es });
  const presentationLabel = format(
    parse(topic.presentationDate, "yyyy-MM-dd", new Date()),
    "d MMM yyyy",
    { locale: es },
  );

  return (
    <Card className="border-stone-200/80 shadow-sm transition-shadow hover:shadow-md">
      <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0 pb-2">
        <div className="min-w-0 flex-1 space-y-2 text-left">
          <CardTitle className="text-base leading-snug">{topic.title}</CardTitle>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="text-xs">
              {getCategoryName(topic.categoryId)}
            </Badge>
            <Badge variant="outline" className="text-xs">
              Exposición: {presentationLabel}
            </Badge>
          </div>
        </div>
        <div className="flex shrink-0 gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-lg"
            onClick={() => onEdit(topic)}
            aria-label="Editar tema"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-lg text-red-600 hover:bg-red-50 hover:text-red-700"
            onClick={() => onDelete(topic)}
            aria-label="Eliminar tema"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 text-left">
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-stone-600">
          {topic.content || (
            <span className="italic text-stone-400">
              Sin apuntes todavía. Edita el tema para añadirlos.
            </span>
          )}
        </p>
        <p className="text-xs text-stone-400">Actualizado: {updatedLabel}</p>
      </CardContent>
    </Card>
  );
}
