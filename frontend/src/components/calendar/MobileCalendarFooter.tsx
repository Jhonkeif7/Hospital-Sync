import { Heart } from "lucide-react";

export function MobileCalendarFooter() {
  return (
    <div className="mx-4 mb-6 rounded-2xl bg-[#f5f0e8] px-6 py-8 text-center xl:hidden">
      <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center">
        <Heart className="h-6 w-6 text-stone-600" strokeWidth={1.5} />
      </div>
      <p className="text-base font-semibold text-stone-800">10 semanas organizadas</p>
      <p className="mt-1 text-sm text-stone-600">¡Tú puedes!</p>
    </div>
  );
}
