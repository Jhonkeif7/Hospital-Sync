import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AuthProvider } from "@/context/AuthContext";
import { TopicsProvider } from "@/context/TopicsContext";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <TopicsProvider>
        <App />
      </TopicsProvider>
    </AuthProvider>
  </StrictMode>,
);
