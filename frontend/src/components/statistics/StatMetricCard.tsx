import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatMetricCardProps {
  label: string;
  value: string | number;
  hint?: string;
  icon: LucideIcon;
  accent?: "beige" | "green" | "stone";
}

const accentStyles = {
  beige: "bg-[#f5f0e8] text-stone-700",
  green: "bg-[#dfe8df] text-[#3d6b4a]",
  stone: "bg-stone-100 text-stone-600",
};

export function StatMetricCard({
  label,
  value,
  hint,
  icon: Icon,
  accent = "beige",
}: StatMetricCardProps) {
  return (
    <div className="rounded-2xl border border-stone-200/80 bg-white p-4 sm:p-5">
      <div className="flex items-start gap-4">
        <div
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
            accentStyles[accent],
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0 text-left">
          <p className="text-2xl font-semibold text-stone-800">{value}</p>
          <p className="text-sm text-stone-500">{label}</p>
          {hint ? <p className="mt-1 text-xs text-stone-400">{hint}</p> : null}
        </div>
      </div>
    </div>
  );
}
