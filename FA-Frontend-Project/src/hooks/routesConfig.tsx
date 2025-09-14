import { Budget } from "@/Pages/Budgets/Budget";
import { Budgets } from "@/Pages/Budgets/Budgets";
import Cart from "@/Pages/Cart/Cart";
import { Catalog } from "@/Pages/Catalog/Catalog";
import { Categories } from "@/Pages/Categories/Categories";
import Category from "@/Pages/Categories/Category";
import { Client } from "@/Pages/Clients/Client";
import { Clients } from "@/Pages/Clients/Clients";
import Home from "@/Pages/Home/Home";
import { ProductPage } from "@/Pages/Products/CompleteProductPage/ProductPage";
import { Products } from "@/Pages/Products/Products";
import { Provider } from "@/Pages/Providers/Provider";
import { Providers } from "@/Pages/Providers/Providers";
import CashRegister from "@/Pages/Register/CashRegister";
import DailyCashRegister from "@/Pages/Register/DailyCashRegister";
import { Sales } from "@/Pages/Sales/Sales";
import { Stock } from "@/Pages/Stock/Stock";
import { StockList } from "@/Pages/Stock/StockList";
import { Subcategory } from "@/Pages/Subcategory/Subcategory";

export const routesConfig = [
  { index: true, element: <Home /> },
  // Catalog
  { path: "/catalog", element: <Catalog /> },
  { path: "/catalog/products", element: <Products /> },
  { path: "/catalog/products/:id", element: <ProductPage /> },
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
  { path: "/sales/budgets", element: <Budgets /> },
  { path: "/sales/budgets/:id", element: <Budget /> },
  { path: "/sales/cart", element: <Cart /> },
  //{ path: "/sales/budgets/add", element: <AddBudget /> },
  { path: "/sales/register", element: <CashRegister /> },
  { path: "/sales/register/:date", element: <DailyCashRegister /> },
];
