import { cn } from "@/lib/utils";

export interface ChartBarItem {
  label: string;
  value: number;
  color?: string;
}

interface HorizontalBarChartProps {
  items: ChartBarItem[];
  emptyMessage?: string;
}

const defaultColors = ["#9a8268", "#b8a088", "#7a9f86", "#c9b896", "#8b7355", "#5a8f6a"];

export function HorizontalBarChart({
  items,
  emptyMessage = "Sin datos para mostrar.",
}: HorizontalBarChartProps) {
  if (items.length === 0) {
    return <p className="text-sm text-stone-500">{emptyMessage}</p>;
  }

  const maxValue = Math.max(...items.map((item) => item.value), 1);

  return (
    <div className="space-y-4">
      {items.map((item, index) => {
        const width = Math.max((item.value / maxValue) * 100, item.value > 0 ? 8 : 0);
        const color = item.color ?? defaultColors[index % defaultColors.length];

        return (
          <div key={item.label}>
            <div className="mb-1.5 flex items-center justify-between gap-3 text-sm">
              <span className="truncate text-stone-700">{item.label}</span>
              <span className="shrink-0 font-medium text-stone-800">{item.value}</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-stone-100">
              <div
                className={cn("h-full rounded-full transition-all duration-500")}
                style={{ width: `${width}%`, backgroundColor: color }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
