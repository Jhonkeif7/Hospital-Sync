import { Bell, Menu } from "lucide-react";
import { useLayout } from "@/context/LayoutContext";
import { useIsMobileNav } from "@/hooks/useMediaQuery";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AppHeaderProps {
  title: string;
  subtitle?: string;
  /** Oculta el botón de menú (p. ej. vista de detalle con botón atrás) */
  hideMenu?: boolean;
}

export function AppHeader({ title, subtitle, hideMenu = false }: AppHeaderProps) {
  const { openMobileNav } = useLayout();
  const showMobileMenu = useIsMobileNav() && !hideMenu;

  return (
    <header className="border-b border-stone-200/80 bg-white px-4 py-4 lg:px-6 lg:py-5">
      <div
        className={cn(
          "grid items-center gap-3",
          showMobileMenu ? "grid-cols-[auto_1fr_auto]" : "flex flex-col sm:flex-row sm:items-center sm:justify-between",
        )}
      >
        {showMobileMenu ? (
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 rounded-xl"
            onClick={openMobileNav}
            aria-label="Abrir menú"
          >
            <Menu className="h-5 w-5" />
          </Button>
        ) : null}

        <div className={cn("text-left", showMobileMenu && "text-center")}>
          <h1
            className={cn(
              "font-semibold tracking-tight text-stone-800",
              showMobileMenu ? "text-lg" : "text-2xl",
            )}
          >
            {title}
          </h1>
          {subtitle ? (
            <p className={cn("text-stone-500", showMobileMenu ? "text-xs" : "mt-1 text-sm")}>
              {subtitle}
            </p>
          ) : null}
        </div>

        <div className={cn("flex items-center gap-2", showMobileMenu && "justify-end")}>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Bell className="h-4 w-4" />
          </Button>
          <Avatar className="h-9 w-9">
            <AvatarFallback className="text-xs">MS</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
