import { Navigate, Route, Routes } from "react-router-dom";
import { CalendarPage } from "@/pages/CalendarPage";
import { StatisticsPage } from "@/pages/StatisticsPage";
import { TopicsPage } from "@/pages/TopicsPage";
import { SettingsPage } from "@/pages/SettingsPage";

export function AppRoutes() {
  return (
    <Routes>
      <Route index element={<CalendarPage />} />
      <Route path="temas" element={<TopicsPage />} />
      <Route path="estadisticas" element={<StatisticsPage />} />
      <Route path="ajustes" element={<SettingsPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
