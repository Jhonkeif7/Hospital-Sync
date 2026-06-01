import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AppLayout } from "@/components/layout/AppLayout";
import { useAuth } from "@/context/AuthContext";
import { LoginPage } from "@/pages/LoginPage";

const CalendarPage = lazy(() =>
  import("@/pages/CalendarPage").then((m) => ({ default: m.CalendarPage })),
);
const DayDetailPage = lazy(() =>
  import("@/pages/DayDetailPage").then((m) => ({ default: m.DayDetailPage })),
);
const TopicsPage = lazy(() =>
  import("@/pages/TopicsPage").then((m) => ({ default: m.TopicsPage })),
);
const SettingsPage = lazy(() =>
  import("@/pages/SettingsPage").then((m) => ({ default: m.SettingsPage })),
);
const StatisticsPage = lazy(() =>
  import("@/pages/StatisticsPage").then((m) => ({ default: m.StatisticsPage })),
);

function PageLoader() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center text-sm text-stone-500">
      Cargando…
    </div>
  );
}

function PublicOnlyRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <PageLoader />;
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route
            path="/login"
            element={
              <PublicOnlyRoute>
                <LoginPage />
              </PublicOnlyRoute>
            }
          />

          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route index element={<CalendarPage />} />
              <Route path="dia/:date" element={<DayDetailPage />} />
              <Route path="temas" element={<TopicsPage />} />
              <Route path="estadisticas" element={<StatisticsPage />} />
              <Route path="ajustes" element={<SettingsPage />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
