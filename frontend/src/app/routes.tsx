import { Navigate, Route, Routes } from "react-router-dom";
import { CalendarPage } from "@/pages/CalendarPage";
import { PlaceholderPage } from "@/pages/PlaceholderPage";

export function AppRoutes() {
  return (
    <Routes>
      <Route index element={<CalendarPage />} />
      <Route
        path="temas"
        element={
          <PlaceholderPage
            title="Mis temas"
            description="Aquí podrás gestionar todos tus temas médicos asignados a los días de servicio."
          />
        }
      />
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
      <Route
        path="ajustes"
        element={
          <PlaceholderPage
            title="Ajustes"
            description="Configura tu intervalo de servicio, notificaciones y preferencias."
          />
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
