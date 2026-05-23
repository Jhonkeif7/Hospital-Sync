import { useNavigate } from "react-router-dom";
import { ArrowLeft, Bell, MoreVertical } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface DayDetailHeaderProps {
  title: string;
}

export function DayDetailHeader({ title }: DayDetailHeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="grid grid-cols-[auto_1fr_auto] items-center gap-2 border-b border-stone-200/80 bg-white px-4 py-4 xl:hidden">
      <Button
        variant="ghost"
        size="icon"
        className="shrink-0 rounded-xl"
        onClick={() => navigate(-1)}
        aria-label="Volver al calendario"
      >
        <ArrowLeft className="h-5 w-5" />
      </Button>

      <h1 className="truncate text-center text-base font-semibold capitalize text-stone-800">
        {title}
      </h1>

      <div className="flex items-center justify-end gap-1">
        <Button variant="ghost" size="icon" className="rounded-full">
          <MoreVertical className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="hidden rounded-full sm:inline-flex">
          <Bell className="h-4 w-4" />
        </Button>
        <Avatar className="hidden h-8 w-8 sm:flex">
          <AvatarFallback className="text-[10px]">MS</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
