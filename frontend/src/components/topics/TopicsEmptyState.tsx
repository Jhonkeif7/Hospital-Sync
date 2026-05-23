import { BookOpen } from "lucide-react";

export function TopicsEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-stone-300 bg-stone-50/50 px-6 py-16 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f5f0e8]">
        <BookOpen className="h-7 w-7 text-stone-600" />
      </div>
      <h3 className="text-lg font-semibold text-stone-800">Aún no hay temas</h3>
      <p className="mt-2 max-w-sm text-sm text-stone-500">
        Crea tu primer tema con título y apuntes para organizar lo que estudias en el servicio
        hospitalario.
      </p>
    </div>
  );
}
