import { CalendarDays, Clock, List, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { CalendarStats } from "@/types/calendar";

interface StatsSummaryProps {
  stats: CalendarStats;
}

const statItems = [
  { key: "serviceDays", label: "Días de servicio", icon: CalendarDays },
  { key: "weeks", label: "Semanas", icon: Clock },
  { key: "topicsCount", label: "Temas registrados", icon: List },
  { key: "organizationPercent", label: "Organización", icon: TrendingUp, suffix: "%" },
] as const;

export function StatsSummary({ stats }: StatsSummaryProps) {
  return (
    <div className="grid gap-4 px-4 py-5 sm:px-6 md:grid-cols-2 xl:grid-cols-4">
      {statItems.map((item) => {
        const value = stats[item.key];
        const Icon = item.icon;

        return (
          <Card key={item.key} className="border-stone-200/80 bg-white">
            <CardContent className="flex items-center gap-4 p-4 sm:p-5">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f5f0e8]">
                <Icon className="h-5 w-5 text-stone-600" />
              </div>
              <div className="text-left">
                <p className="text-2xl font-semibold text-stone-800">
                  {value}
                  {"suffix" in item ? item.suffix : ""}
                </p>
                <p className="text-sm text-stone-500">{item.label}</p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
