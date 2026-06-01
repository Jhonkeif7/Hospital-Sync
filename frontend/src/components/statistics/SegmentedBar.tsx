interface SegmentedBarProps {
  segments: Array<{
    label: string;
    value: number;
    color: string;
  }>;
  emptyMessage?: string;
}

export function SegmentedBar({
  segments,
  emptyMessage = "Sin datos para mostrar.",
}: SegmentedBarProps) {
  const total = segments.reduce((sum, segment) => sum + segment.value, 0);

  if (total === 0) {
    return <p className="text-sm text-stone-500">{emptyMessage}</p>;
  }

  return (
    <div className="space-y-4">
      <div className="flex h-4 overflow-hidden rounded-full bg-stone-100">
        {segments.map((segment) =>
          segment.value > 0 ? (
            <div
              key={segment.label}
              className="h-full transition-all duration-500"
              style={{
                width: `${(segment.value / total) * 100}%`,
                backgroundColor: segment.color,
              }}
              title={`${segment.label}: ${segment.value}`}
            />
          ) : null,
        )}
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        {segments.map((segment) => (
          <div key={segment.label} className="flex items-center gap-2 text-sm">
            <span
              className="h-3 w-3 shrink-0 rounded-full"
              style={{ backgroundColor: segment.color }}
            />
            <span className="text-stone-600">{segment.label}</span>
            <span className="ml-auto font-medium text-stone-800">{segment.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
