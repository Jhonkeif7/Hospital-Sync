import { useState } from "react";
import { FolderOpen, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CategoryManageDialog } from "@/components/topics/CategoryManageDialog";
import { useTopics } from "@/context/TopicsContext";

export interface TopicsListFilters {
  searchQuery: string;
  categoryId: string;
  dateFrom: string;
  dateTo: string;
}

interface TopicsFiltersBarProps {
  filters: TopicsListFilters;
  onFiltersChange: (partial: Partial<TopicsListFilters>) => void;
}

export function TopicsFiltersBar({ filters, onFiltersChange }: TopicsFiltersBarProps) {
  const { categories } = useTopics();
  const [categoriesOpen, setCategoriesOpen] = useState(false);

  return (
    <>
      <div className="space-y-3 border-b border-stone-200/80 bg-stone-50/50 px-4 py-4 sm:px-6">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
          <Input
            type="search"
            placeholder="Buscar por título o contenido..."
            className="h-11 rounded-xl bg-white pl-9"
            value={filters.searchQuery}
            onChange={(e) => onFiltersChange({ searchQuery: e.target.value })}
          />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
          <div className="min-w-0 flex-1 space-y-1 text-left sm:max-w-[200px]">
            <Label className="text-xs text-stone-500">Categoría</Label>
            <Select
              value={filters.categoryId}
              onValueChange={(value) => onFiltersChange({ categoryId: value })}
            >
              <SelectTrigger className="h-11 rounded-xl bg-white">
                <SelectValue placeholder="Todas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las categorías</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid flex-1 grid-cols-2 gap-2 sm:max-w-xs">
            <div className="space-y-1 text-left">
              <Label htmlFor="topics-from" className="text-xs text-stone-500">
                Desde
              </Label>
              <Input
                id="topics-from"
                type="date"
                className="h-11 rounded-xl bg-white"
                value={filters.dateFrom}
                onChange={(e) => onFiltersChange({ dateFrom: e.target.value })}
              />
            </div>
            <div className="space-y-1 text-left">
              <Label htmlFor="topics-to" className="text-xs text-stone-500">
                Hasta
              </Label>
              <Input
                id="topics-to"
                type="date"
                className="h-11 rounded-xl bg-white"
                value={filters.dateTo}
                onChange={(e) => onFiltersChange({ dateTo: e.target.value })}
              />
            </div>
          </div>

          <Button
            type="button"
            variant="secondary"
            className="h-11 shrink-0 rounded-xl"
            onClick={() => setCategoriesOpen(true)}
          >
            <FolderOpen className="h-4 w-4" />
            Categorías
          </Button>
        </div>
      </div>

      <CategoryManageDialog open={categoriesOpen} onOpenChange={setCategoriesOpen} />
    </>
  );
}
