import App from "@/App.tsx";
import CatalogContextComponent from "@/Context/CatalogContextComponent.tsx";
import CategoryContextComponent from "@/Context/Category/CategoryContextComponent.tsx";
import SalesContextComponent from "@/Context/SalesContextComponent.tsx";
import SubcategoryContextComponent from "@/Context/Subcategory/SubcategoryContextComponent";
import { ThemeProvider } from "@/Context/theme-provider.tsx";
import ScrollToHashElement from "@/hooks/ScrollToHasComponent.tsx";
import { KindeProvider } from "@kinde-oss/kinde-auth-react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

const clientId = import.meta.env.VITE_KINDE_CLIENT_ID;
const domain = import.meta.env.VITE_KINDE_DOMAIN;
const redirectUri = import.meta.env.VITE_KINDE_REDIRECT_URI;
const logoutUri = import.meta.env.VITE_KINDE_LOGOUT_URI;
const audience = import.meta.env.VITE_KINDE_AUDIENCE;

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <KindeProvider
      clientId={clientId}
      domain={domain}
      redirectUri={redirectUri}
      logoutUri={logoutUri}
      audience={audience}
    >
      <CatalogContextComponent>
        <CategoryContextComponent>
          <SubcategoryContextComponent>
            <SalesContextComponent>
              <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
                <ScrollToHashElement />
                <App />
              </ThemeProvider>
            </SalesContextComponent>
          </SubcategoryContextComponent>
        </CategoryContextComponent>
      </CatalogContextComponent>
    </KindeProvider>
  </BrowserRouter>
);
