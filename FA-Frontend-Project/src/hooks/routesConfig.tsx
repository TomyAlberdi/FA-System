import { Catalog } from "@/Pages/Catalog/Catalog";
import { Categories } from "@/Pages/Categories/Categories";
import Category from "@/Pages/Categories/Category";
import Home from "@/Pages/Home/Home";
import { Products } from "@/Pages/Products/Products";
import { Providers } from "@/Pages/Providers/Providers";
import { Provider } from "@/Pages/Providers/Provider";
import User from "@/Pages/User/User";
import { AddProduct } from "@/Pages/Products/AddProduct";
import { Subcategory } from "@/Pages/Subcategory/Subcategory";
import { ProductPage } from "@/Pages/Products/CompleteProductPage/ProductPage";
import { Stock } from "@/Pages/Stock/Stock";

export const routesConfig = [
  { index: true, element: <Home />, handle: "Inicio" },
  { path: "/user", element: <User />, handle: "Usuario" },
  { path: "/catalog", element: <Catalog />, handle: "Catálogo" },
  { path: "/catalog/products", element: <Products />, handle: "Productos" },
  { path: "/catalog/products/:id", element: <ProductPage />, handle: "Producto" },
  { path: "/catalog/products/add", element: <AddProduct />, handle: "Añadir Producto" },
  { path: "/catalog/products/stock/:id", element: <Stock />, handle: "Stock" },
  { path: "/catalog/providers", element: <Providers />, handle: "Proveedores" },
  { path: "/catalog/providers/:id", element: <Provider /> },
  { path: "/catalog/categories", element: <Categories />, handle: "Categorías" },
  { path: "/catalog/categories/:id", element: <Category /> },
  { path: "/catalog/categories/subcategory", handle: "Subcategoría" },
  { path: "/catalog/categories/subcategory/:id", element: <Subcategory /> },
];
