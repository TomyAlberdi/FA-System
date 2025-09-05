import App from "@/App.tsx";
import CategoryContextComponent from "@/Context/Category/CategoryContextComponent.tsx";
import SubcategoryContextComponent from "@/Context/Subcategory/SubcategoryContextComponent";
import { ThemeProvider } from "@/Context/theme-provider.tsx";
import ScrollToHashElement from "@/hooks/ScrollToHasComponent.tsx";
import { KindeProvider } from "@kinde-oss/kinde-auth-react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import BudgetContextComponent from "./Context/Budget/BudgetContextComponent";
import ClientContextComponent from "./Context/Client/ClientContextComponent";
import ProductContextComponent from "./Context/Product/ProductContextComponent";
import ProviderContextComponent from "./Context/Provider/ProviderContextComponent";
import StockContextComponent from "./Context/Stock/StockContextComponent";

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
      <CategoryContextComponent>
        <SubcategoryContextComponent>
          <ProviderContextComponent>
            <ProductContextComponent>
              <StockContextComponent>
                <ClientContextComponent>
                  <BudgetContextComponent>
                    <ThemeProvider
                      defaultTheme="light"
                      storageKey="vite-ui-theme"
                    >
                      <ScrollToHashElement />
                      <App />
                    </ThemeProvider>
                  </BudgetContextComponent>
                </ClientContextComponent>
              </StockContextComponent>
            </ProductContextComponent>
          </ProviderContextComponent>
        </SubcategoryContextComponent>
      </CategoryContextComponent>
    </KindeProvider>
  </BrowserRouter>
);
