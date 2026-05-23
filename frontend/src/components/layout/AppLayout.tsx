import { Outlet } from "react-router-dom";
import { LayoutProvider } from "@/context/LayoutContext";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { MobileDrawer } from "@/components/layout/MobileDrawer";

export function AppLayout() {
  return (
    <LayoutProvider>
      <div className="flex h-screen overflow-hidden bg-stone-50">
        <AppSidebar />
        <MobileDrawer />
        <main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
          <Outlet />
        </main>
      </div>
    </LayoutProvider>
  );
}
