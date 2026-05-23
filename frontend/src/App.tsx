import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AppLayout } from "@/components/layout/AppLayout";
import { useAuth } from "@/context/AuthContext";
import { CalendarPage } from "@/pages/CalendarPage";
import { DayDetailPage } from "@/pages/DayDetailPage";
import { LoginPage } from "@/pages/LoginPage";
import { TopicsPage } from "@/pages/TopicsPage";
import { PlaceholderPage } from "@/pages/PlaceholderPage";
import { SettingsPage } from "@/pages/SettingsPage";

function PublicOnlyRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
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
            <Route
              path="resumen"
              element={
                <PlaceholderPage
                  title="Resumen"
                  description="Vista general de tu progreso y organización del servicio hospitalario."
                />
              }
            />
            <Route
              path="estadisticas"
              element={
                <PlaceholderPage
                  title="Estadísticas"
                  description="Métricas detalladas sobre tus días de servicio y temas estudiados."
                />
              }
            />
            <Route path="ajustes" element={<SettingsPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
