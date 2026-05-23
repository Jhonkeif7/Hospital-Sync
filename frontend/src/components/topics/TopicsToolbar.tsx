import { Menu, Plus } from "lucide-react";
import { useLayout } from "@/context/LayoutContext";
import { useIsMobileNav } from "@/hooks/useMediaQuery";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TopicsToolbarProps {
  topicCount: number;
  totalCount?: number;
  onAddClick: () => void;
}

export function TopicsToolbar({ topicCount, totalCount, onAddClick }: TopicsToolbarProps) {
  const { openMobileNav } = useLayout();
  const showMobileMenu = useIsMobileNav();

  return (
    <div className="border-b border-stone-200/80 bg-white px-4 py-4 lg:px-6 lg:py-5">
      <div
        className={cn(
          "flex flex-col gap-4",
          showMobileMenu
            ? "sm:flex-row sm:items-center sm:justify-between"
            : "sm:flex-row sm:items-center sm:justify-between",
        )}
      >
        {showMobileMenu ? (
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="shrink-0 rounded-xl lg:hidden"
              onClick={openMobileNav}
              aria-label="Abrir menú"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="text-left">
              <h1 className="text-xl font-semibold tracking-tight text-stone-800 sm:text-2xl">
                Mis temas
              </h1>
              <p className="mt-0.5 text-sm text-stone-500">
                {totalCount !== undefined && totalCount !== topicCount
                  ? `${topicCount} de ${totalCount} temas`
                  : topicCount === 1
                    ? "1 tema registrado"
                    : `${topicCount} temas registrados`}
              </p>
            </div>
          </div>
        ) : (
          <div className="text-left">
            <h1 className="text-2xl font-semibold tracking-tight text-stone-800">Mis temas</h1>
            <p className="mt-1 text-sm text-stone-500">
              {totalCount !== undefined && totalCount !== topicCount
                ? `${topicCount} de ${totalCount} temas`
                : topicCount === 1
                  ? "1 tema registrado"
                  : `${topicCount} temas registrados`}
            </p>
          </div>
        )}

        <Button className="w-full rounded-xl sm:w-auto" onClick={onAddClick}>
          <Plus className="h-4 w-4" />
          Agregar tema
        </Button>
      </div>
    </div>
  );
}
