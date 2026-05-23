import { useState } from "react";
import { FolderOpen, Pencil, Plus, Trash2 } from "lucide-react";
import { useTopics } from "@/context/TopicsContext";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { TopicCategory } from "@/types/medicalTopic";

interface CategoryManageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CategoryManageDialog({ open, onOpenChange }: CategoryManageDialogProps) {
  const { categories, addCategory, updateCategory, deleteCategory } = useTopics();
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleAdd = () => {
    if (!newName.trim()) return;
    addCategory({ name: newName });
    setNewName("");
    setError(null);
  };

  const startEdit = (cat: TopicCategory) => {
    setEditingId(cat.id);
    setEditName(cat.name);
    setError(null);
  };

  const saveEdit = () => {
    if (!editingId || !editName.trim()) return;
    updateCategory(editingId, { name: editName });
    setEditingId(null);
    setEditName("");
  };

  const handleDelete = (id: string) => {
    const result = deleteCategory(id);
    if (!result.ok) {
      setError(result.error ?? "No se pudo eliminar");
      return;
    }
    setError(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FolderOpen className="h-5 w-5" />
            Gestionar categorías
          </DialogTitle>
          <DialogDescription>
            Añade, edita o elimina categorías para organizar tus temas médicos.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="flex gap-2">
            <div className="flex-1 space-y-1 text-left">
              <Label htmlFor="new-cat" className="text-xs">
                Nueva categoría
              </Label>
              <Input
                id="new-cat"
                placeholder="Ej. Cardiología"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="rounded-xl"
              />
            </div>
            <Button
              type="button"
              className="mt-6 shrink-0 rounded-xl"
              onClick={handleAdd}
              disabled={!newName.trim()}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {error ? <p className="text-left text-sm text-red-600">{error}</p> : null}

          <ul className="max-h-64 space-y-2 overflow-y-auto">
            {categories.map((cat) => (
              <li
                key={cat.id}
                className="flex items-center gap-2 rounded-xl border border-stone-200 bg-stone-50/50 p-3"
              >
                {editingId === cat.id ? (
                  <>
                    <Input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="h-9 flex-1 rounded-lg"
                    />
                    <Button type="button" size="sm" onClick={saveEdit}>
                      Guardar
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      onClick={() => setEditingId(null)}
                    >
                      Cancelar
                    </Button>
                  </>
                ) : (
                  <>
                    <span className="flex-1 text-left text-sm font-medium text-stone-800">
                      {cat.name}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => startEdit(cat)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-600"
                      onClick={() => handleDelete(cat.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
}
