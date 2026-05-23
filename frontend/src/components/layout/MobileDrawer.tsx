import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useLayout } from "@/context/LayoutContext";
import { AppSidebar } from "@/components/layout/AppSidebar";
export function MobileDrawer() {
  const { mobileNavOpen, closeMobileNav } = useLayout();
  const location = useLocation();

  useEffect(() => {
    closeMobileNav();
  }, [location.pathname, closeMobileNav]);

  useEffect(() => {
    document.body.style.overflow = mobileNavOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileNavOpen]);

  if (!mobileNavOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <button
        type="button"
        className="absolute inset-0 bg-stone-900/40 backdrop-blur-[1px]"
        onClick={closeMobileNav}
        aria-label="Cerrar menú"
      />
      <div
        className="absolute left-0 top-0 h-full w-[min(280px,85vw)] shadow-xl"
      >
        <AppSidebar onNavigate={closeMobileNav} mobile />
      </div>
    </div>
  );
}
