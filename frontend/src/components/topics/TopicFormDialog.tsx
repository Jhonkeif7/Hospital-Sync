import { useEffect, useState } from "react";
import { useTopics } from "@/context/TopicsContext";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { MedicalTopic, TopicFormValues } from "@/types/medicalTopic";

interface TopicFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  topic?: MedicalTopic;
  onSubmit: (values: TopicFormValues) => void;
}

export function TopicFormDialog({
  open,
  onOpenChange,
  mode,
  topic,
  onSubmit,
}: TopicFormDialogProps) {
  const { categories } = useTopics();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [presentationDate, setPresentationDate] = useState("");

  useEffect(() => {
    if (open) {
      setTitle(topic?.title ?? "");
      setContent(topic?.content ?? "");
      setCategoryId(topic?.categoryId ?? categories[0]?.id ?? "");
      setPresentationDate(
        topic?.presentationDate ?? new Date().toISOString().slice(0, 10),
      );
    }
  }, [open, topic, categories]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!title.trim() || !categoryId || !presentationDate) return;

    onSubmit({
      title,
      content,
      categoryId,
      presentationDate,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{mode === "create" ? "Agregar tema" : "Editar tema"}</DialogTitle>
            <DialogDescription>
              Completa el título, categoría, fecha de exposición y apuntes del tema.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2 text-left">
              <Label htmlFor="topic-title">
                Título <span className="text-red-500">*</span>
              </Label>
              <Input
                id="topic-title"
                placeholder="Ej. Neumonía adquirida en la comunidad"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                required
              />
            </div>

            <div className="space-y-2 text-left">
              <Label htmlFor="topic-category">
                Categoría <span className="text-red-500">*</span>
              </Label>
              <Select value={categoryId} onValueChange={setCategoryId} required>
                <SelectTrigger id="topic-category" className="rounded-xl">
                  <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 text-left">
              <Label htmlFor="topic-date">
                Fecha de exposición <span className="text-red-500">*</span>
              </Label>
              <Input
                id="topic-date"
                type="date"
                className="rounded-xl"
                value={presentationDate}
                onChange={(event) => setPresentationDate(event.target.value)}
                required
              />
            </div>

            <div className="space-y-2 text-left">
              <Label htmlFor="topic-content">Contenido / apuntes</Label>
              <Textarea
                id="topic-content"
                placeholder="Escribe aquí tus apuntes, protocolos, casos clínicos..."
                value={content}
                onChange={(event) => setContent(event.target.value)}
                className="min-h-[140px]"
              />
            </div>
          </div>

          <DialogFooter className="flex-col gap-2 sm:flex-row">
            <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={!title.trim() || !categoryId || !presentationDate}>
              {mode === "create" ? "Guardar tema" : "Actualizar tema"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
