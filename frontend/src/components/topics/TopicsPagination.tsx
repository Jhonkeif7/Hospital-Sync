import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const TOPICS_PAGE_SIZE = 9;

interface TopicsPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize?: number;
  onPageChange: (page: number) => void;
}

function getVisiblePages(current: number, total: number): (number | "ellipsis")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | "ellipsis")[] = [1];

  if (current > 3) pages.push("ellipsis");

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  for (let page = start; page <= end; page += 1) {
    pages.push(page);
  }

  if (current < total - 2) pages.push("ellipsis");

  pages.push(total);
  return pages;
}

export function TopicsPagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize = TOPICS_PAGE_SIZE,
  onPageChange,
}: TopicsPaginationProps) {
  const start = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalItems);
  const visiblePages = getVisiblePages(currentPage, totalPages);
  const showNav = totalPages > 1;

  if (totalItems === 0) return null;

  return (
    <div className="mt-8 flex flex-col items-center gap-4 border-t border-stone-200/80 pt-6 sm:flex-row sm:justify-between">
      <p className="text-sm text-stone-500">
        Mostrando {start}–{end} de {totalItems} temas
      </p>

      {showNav ? (
      <nav className="flex items-center gap-1" aria-label="Paginación de temas">
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9 rounded-lg"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          aria-label="Página anterior"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {visiblePages.map((page, index) =>
          page === "ellipsis" ? (
            <span key={`ellipsis-${index}`} className="px-2 text-stone-400">
              …
            </span>
          ) : (
            <Button
              key={page}
              variant={page === currentPage ? "default" : "outline"}
              size="sm"
              className={cn(
                "h-9 min-w-9 rounded-lg",
                page === currentPage && "bg-[#f5f0e8] text-stone-800 hover:bg-[#ebe3d8]",
              )}
              onClick={() => onPageChange(page)}
              aria-label={`Página ${page}`}
              aria-current={page === currentPage ? "page" : undefined}
            >
              {page}
            </Button>
          ),
        )}

        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9 rounded-lg"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          aria-label="Página siguiente"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </nav>
      ) : null}
    </div>
  );
}
