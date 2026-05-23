import type { ReactNode } from "react";

interface PageShellProps {
  header: ReactNode;
  children: ReactNode;
  /** Contenido a ancho completo sin scroll propio (p. ej. calendario con panel lateral) */
  fullHeightBody?: boolean;
}

export function PageShell({ header, children, fullHeightBody = false }: PageShellProps) {
  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <div className="z-10 shrink-0 bg-white">{header}</div>
      {fullHeightBody ? (
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">{children}</div>
      ) : (
        <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
      )}
    </div>
  );
}
