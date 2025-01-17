import { Catalog } from "@/Pages/Catalog/Catalog";
import { Categories } from "@/Pages/Categories/Categories";
import Category from "@/Pages/Categories/Category";
import Home from "@/Pages/Home/Home";
import { Products } from "@/Pages/Products/Products";
import { Providers } from "@/Pages/Providers/Providers";
import { Provider } from "@/Pages/Providers/Provider";
import { AddProduct } from "@/Pages/Products/AddProduct";
import { Subcategory } from "@/Pages/Subcategory/Subcategory";
import { ProductPage } from "@/Pages/Products/CompleteProductPage/ProductPage";
import { Stock } from "@/Pages/Stock/Stock";
import { StockList } from "@/Pages/Stock/StockList";
import { UpdateProduct } from "@/Pages/Products/UpdateProduct";
import { Sales } from "@/Pages/Sales/Sales";
import { Clients } from "@/Pages/Clients/Clients";
import { Client } from "@/Pages/Clients/Client";

export const routesConfig = [
  { index: true, element: <Home /> },
  // Catalog
  { path: "/catalog", element: <Catalog /> },
  { path: "/catalog/products", element: <Products /> },
  { path: "/catalog/products/:id", element: <ProductPage /> },
  { path: "/catalog/products/add", element: <AddProduct /> },
  { path: "/catalog/products/:id/update", element: <UpdateProduct /> },
  { path: "/catalog/stock", element: <StockList /> },
  { path: "/catalog/stock/:id", element: <Stock /> },
  { path: "/catalog/providers", element: <Providers /> },
  { path: "/catalog/providers/:id", element: <Provider /> },
  { path: "/catalog/categories", element: <Categories /> },
  { path: "/catalog/categories/:id", element: <Category /> },
  { path: "/catalog/subcategory/:id", element: <Subcategory /> },
  // Sales
  { path: "/sales", element: <Sales /> },
  { path: "/sales/clients", element: <Clients /> },
  { path: "/sales/clients/:id", element: <Client /> },
];
