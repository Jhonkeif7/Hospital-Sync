import { NavLink } from "react-router-dom";
import {
  BookOpen,
  CalendarDays,
  Heart,
  Settings,
  Stethoscope,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/types/calendar";

const navItems: NavItem[] = [
  { id: "calendar", label: "Calendario", icon: CalendarDays, path: "/" },
  { id: "topics", label: "Mis temas", icon: BookOpen, path: "/temas" },
  { id: "stats", label: "Estadísticas", icon: TrendingUp, path: "/estadisticas" },
  { id: "settings", label: "Ajustes", icon: Settings, path: "/ajustes" },
];

interface AppSidebarProps {
  mobile?: boolean;
  onNavigate?: () => void;
}

export function AppSidebar({ mobile = false, onNavigate }: AppSidebarProps) {
  return (
    <aside
      className={cn(
        "flex h-full flex-col border-r border-stone-200/80 bg-white px-4 py-6",
        mobile ? "h-screen w-full" : "sticky top-0 hidden h-screen w-64 shrink-0 overflow-y-auto lg:flex",
      )}
    >
      <div className="mb-8 flex items-center gap-3 px-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f5f0e8]">
          <Stethoscope className="h-5 w-5 text-stone-700" />
        </div>
        <div className="text-left">
          <p className="text-sm font-semibold text-stone-800">Hospital Sync</p>
          <p className="text-xs text-stone-500">Mi servicio</p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {navItems.map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            end={item.path === "/"}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-[#f5f0e8] text-stone-800"
                  : "text-stone-600 hover:bg-stone-50 hover:text-stone-800",
              )
            }
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-6 rounded-2xl bg-[#f5f0e8] p-4 text-left">
        <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/70">
          <Heart className="h-4 w-4 text-stone-600" />
        </div>
        <p className="text-sm font-semibold text-stone-800">Tus semanas organizadas</p>
        <p className="mt-1 text-xs text-stone-600">¡Tú puedes!</p>
      </div>
    </aside>
  );
}
