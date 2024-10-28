import { Catalog } from "@/Pages/Catalog/Catalog";
import { Categories } from "@/Pages/Categories/Categories";
import Home from "@/Pages/Home/Home";
import { Products } from "@/Pages/Products/Products";
import { Providers } from "@/Pages/Providers/Providers";
import User from "@/Pages/User/User";

export const routesConfig = [
  { index: true, element: <Home />, handle: "Inicio" },
  { path: "/user", element: <User />, handle: "Usuario" },
  { path: "/catalog", element: <Catalog />, handle: "Catálogo" },
  { path: "/catalog/products", element: <Products />, handle: "Productos" },
  { path: "/catalog/categories", element: <Categories />, handle: "Categorías" },
  { path: "/catalog/providers", element: <Providers />, handle: "Proveedores" },
  { path: "/catalog/providers/test", element: <Providers />, handle: "Proveedores" },
  { path: "/catalog/providers/test/super", element: <Providers />, handle: "Proveedores" },
];
