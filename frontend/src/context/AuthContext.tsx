import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export const DEMO_EMAIL = "rosauraperez3ro@gmail.com";
export const DEMO_PASSWORD = "123";

const AUTH_KEY = "hospital-sync-auth";

interface AuthContextValue {
  isAuthenticated: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function readAuth(): boolean {
  try {
    return (
      sessionStorage.getItem(AUTH_KEY) === "true" ||
      localStorage.getItem(AUTH_KEY) === "true"
    );
  } catch {
    return false;
  }
}

function clearAuthStorage() {
  sessionStorage.removeItem(AUTH_KEY);
  localStorage.removeItem(AUTH_KEY);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(readAuth);

  const login = useCallback(
    (email: string, password: string, rememberMe = false) => {
      const normalizedEmail = email.trim().toLowerCase();
      const valid =
        normalizedEmail === DEMO_EMAIL.toLowerCase() && password === DEMO_PASSWORD;

      if (valid) {
        clearAuthStorage();
        if (rememberMe) {
          localStorage.setItem(AUTH_KEY, "true");
        } else {
          sessionStorage.setItem(AUTH_KEY, "true");
        }
        setIsAuthenticated(true);
      }

      return valid;
    },
    [],
  );

  const logout = useCallback(() => {
    clearAuthStorage();
    setIsAuthenticated(false);
  }, []);

  const value = useMemo(
    () => ({ isAuthenticated, login, logout }),
    [isAuthenticated, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }
  return context;
}
