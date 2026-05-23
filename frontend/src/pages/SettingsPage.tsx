import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { AppHeader } from "@/components/layout/AppHeader";
import { PageShell } from "@/components/layout/PageShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SettingsPage() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <PageShell header={<AppHeader title="Ajustes" />}>
      <div className="p-4 sm:p-6">
        <Card className="max-w-2xl border-stone-200/80">
          <CardHeader>
            <CardTitle>Sesión</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-left">
            <p className="text-sm text-stone-600">
              Cierra sesión para volver a la pantalla de inicio de sesión.
            </p>
            <Button variant="secondary" className="rounded-xl" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              Cerrar sesión
            </Button>
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}
