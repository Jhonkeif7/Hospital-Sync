import {
  Bell,
  BookOpen,
  CalendarDays,
  FolderOpen,
  ListChecks,
  TrendingUp,
} from "lucide-react";
import { HorizontalBarChart } from "@/components/statistics/HorizontalBarChart";
import { SegmentedBar } from "@/components/statistics/SegmentedBar";
import { StatMetricCard } from "@/components/statistics/StatMetricCard";
import { AppHeader } from "@/components/layout/AppHeader";
import { PageShell } from "@/components/layout/PageShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useStatistics } from "@/hooks/useStatistics";

export function StatisticsPage() {
  const { stats, isLoading, error } = useStatistics();

  return (
    <PageShell header={<AppHeader title="Estadísticas" />}>
      <div className="space-y-6 p-4 sm:p-6">
        {error ? (
          <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
        ) : null}

        {isLoading ? (
          <p className="text-sm text-stone-500">Cargando estadísticas…</p>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatMetricCard
                icon={BookOpen}
                label="Temas registrados"
                value={stats.totalTopics}
                hint={`${stats.totalCategories} categorías activas`}
              />
              <StatMetricCard
                icon={CalendarDays}
                label="Días de servicio"
                value={stats.totalServiceDays}
                hint={`${stats.serviceDaysWithNotes} con notas`}
                accent="green"
              />
              <StatMetricCard
                icon={TrendingUp}
                label="Organización"
                value={`${stats.organizationPercent}%`}
                hint="Días de servicio con al menos un tema"
              />
              <StatMetricCard
                icon={ListChecks}
                label="Promedio de temas"
                value={stats.averageTopicsPerServiceDay}
                hint="Por día de servicio"
                accent="stone"
              />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="border-stone-200/80 shadow-none">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <FolderOpen className="h-4 w-4 text-stone-500" />
                    Temas por categoría
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <HorizontalBarChart
                    items={stats.topicsByCategory.map((item) => ({
                      label: item.name,
                      value: item.count,
                    }))}
                    emptyMessage="Aún no tienes temas con categoría asignada."
                  />
                </CardContent>
              </Card>

              <Card className="border-stone-200/80 shadow-none">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <CalendarDays className="h-4 w-4 text-stone-500" />
                    Cobertura en días de servicio
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <SegmentedBar
                    segments={[
                      {
                        label: "Con temas",
                        value: stats.serviceDaysWithTopics,
                        color: "#5a8f6a",
                      },
                      {
                        label: "Sin temas",
                        value: stats.serviceDaysWithoutTopics,
                        color: "#e0d0b8",
                      },
                    ]}
                    emptyMessage="No hay días de servicio en el periodo."
                  />
                </CardContent>
              </Card>

              <Card className="border-stone-200/80 shadow-none">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <BookOpen className="h-4 w-4 text-stone-500" />
                    Temas por mes de exposición
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <HorizontalBarChart
                    items={stats.topicsByMonth.map((item) => ({
                      label: item.label,
                      value: item.count,
                      color: "#9a8268",
                    }))}
                    emptyMessage="Tus temas aparecerán aquí cuando tengan fecha de exposición."
                  />
                </CardContent>
              </Card>

              <Card className="border-stone-200/80 shadow-none">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Bell className="h-4 w-4 text-stone-500" />
                    Recordatorios
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <SegmentedBar
                    segments={[
                      {
                        label: "Completados",
                        value: stats.remindersCompleted,
                        color: "#5a8f6a",
                      },
                      {
                        label: "Pendientes",
                        value: stats.remindersPending,
                        color: "#c9b896",
                      },
                    ]}
                    emptyMessage="No tienes recordatorios creados."
                  />
                  {stats.remindersTotal > 0 ? (
                    <p className="mt-4 text-left text-xs text-stone-500">
                      Total: {stats.remindersTotal} recordatorio
                      {stats.remindersTotal === 1 ? "" : "s"}
                    </p>
                  ) : null}
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </PageShell>
  );
}
