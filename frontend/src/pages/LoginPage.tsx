import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail, Stethoscope } from "lucide-react";
import fondoRP from "@/assets/fondoRP2.webp";
import { DEMO_EMAIL, DEMO_PASSWORD, useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState(DEMO_EMAIL);
  const [password, setPassword] = useState(DEMO_PASSWORD);
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    const success = login(email, password, rememberMe);
    if (success) {
      navigate("/", { replace: true });
      return;
    }

    setError("Correo o contraseña incorrectos. Intenta de nuevo.");
  };

  return (
    <div
      className="relative flex min-h-screen items-center justify-center overflow-y-auto px-4 py-10"
      style={{
        backgroundImage: `url(${fondoRP})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-stone-100/30 backdrop-blur-[1px]" aria-hidden />

      <div className="relative z-10 w-full max-w-[420px] rounded-3xl border border-stone-200/60 bg-white/95 px-8 py-10 shadow-xl shadow-stone-900/10 backdrop-blur-sm sm:px-10 sm:py-12">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-[#e8dfd1] bg-[#faf7f2]">
            <Stethoscope className="h-8 w-8 text-[#9a8268]" strokeWidth={1.5} />
          </div>
          <h1 className="font-serif text-3xl tracking-tight text-stone-800">Hospital Sync</h1>
          <p className="mt-1 text-sm text-[#9a8268]">Tu servicio, organizado.</p>
        </div>

        <div className="mb-6 text-center">
          <h2 className="font-serif text-xl text-stone-800">Bienvenida de nuevo</h2>
          <p className="mt-1 text-sm text-stone-500">Inicia sesión para continuar</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2 text-left">
            <Label htmlFor="email" className="text-sm font-medium text-stone-700">
              Correo electrónico
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="ejemplo@hospital.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 rounded-xl border-stone-200 bg-white pl-10 pr-3"
                required
              />
            </div>
          </div>

          <div className="space-y-2 text-left">
            <Label htmlFor="password" className="text-sm font-medium text-stone-700">
              Contraseña
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 rounded-xl border-stone-200 bg-white pl-10 pr-10"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                onClick={() => setShowPassword((visible) => !visible)}
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 text-sm">
            <label className="flex cursor-pointer items-center gap-2 text-stone-600">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-stone-300 text-[#c4a882] focus:ring-[#e8dfd1]"
              />
              Recordarme
            </label>
            <button
              type="button"
              className="text-[#9a8268] transition hover:text-stone-800"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>

          {error ? (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-center text-sm text-red-600">
              {error}
            </p>
          ) : null}

          <Button
            type="submit"
            className={cn(
              "h-12 w-full rounded-xl text-base font-medium",
              "bg-[#e8dfd1] text-stone-800 hover:bg-[#ddd0bc]",
            )}
          >
            Iniciar sesión
          </Button>
        </form>

        <p className="mt-8 text-center text-sm text-stone-500">
          ¿No tienes una cuenta?{" "}
          <button type="button" className="font-medium text-[#9a8268] hover:text-stone-800">
            Regístrate
          </button>
        </p>
      </div>
    </div>
  );
}
