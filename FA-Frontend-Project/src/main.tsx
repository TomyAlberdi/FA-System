import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import ScrollToHashElement from "@/hooks/ScrollToHasComponent.tsx";
import { KindeProvider } from "@kinde-oss/kinde-auth-react";
import CatalogContextComponent from "@/Context/CatalogContextComponent.tsx";
import { ThemeProvider } from "@/Context/theme-provider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <KindeProvider
      clientId="3ca097572fbe4ab29308c9f21c78b1c5"
      domain="https://fasa.kinde.com"
      redirectUri="http://localhost:5173"
      logoutUri="http://localhost:5173"
      audience="fa-backend-api"
    >
      <CatalogContextComponent>
        <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
          <BrowserRouter>
            <ScrollToHashElement />
            <App />
          </BrowserRouter>
        </ThemeProvider>
      </CatalogContextComponent>
    </KindeProvider>
  </StrictMode>
);
