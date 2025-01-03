import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "@/App.tsx";
import { BrowserRouter } from "react-router-dom";
import ScrollToHashElement from "@/hooks/ScrollToHasComponent.tsx";
import { KindeProvider } from "@kinde-oss/kinde-auth-react";
import CatalogContextComponent from "@/Context/CatalogContextComponent.tsx";
import { ThemeProvider } from "@/Context/theme-provider.tsx";

const clientId = import.meta.env.VITE_KINDE_CLIENT_ID;
const domain = import.meta.env.VITE_KINDE_DOMAIN;
const redirectUri = import.meta.env.VITE_KINDE_REDIRECT_URI;
const logoutUri = import.meta.env.VITE_KINDE_LOGOUT_URI;
const audience = import.meta.env.VITE_KINDE_AUDIENCE;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <KindeProvider
      clientId={clientId}
      domain={domain}
      redirectUri={redirectUri}
      logoutUri={logoutUri}
      audience={audience}
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
