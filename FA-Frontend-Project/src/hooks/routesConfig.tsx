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

export const routesConfig = [
  { index: true, element: <Home />, handle: "Inicio" },
  // { path: "/user", element: <User />, handle: "Usuario" },
  { path: "/catalog", element: <Catalog />, handle: "Catálogo" },
  { path: "/catalog/products", element: <Products />, handle: "Productos" },
  { path: "/catalog/products/:id", element: <ProductPage />, handle: "Producto" },
  { path: "/catalog/products/add", element: <AddProduct />, handle: "Añadir Producto" },
  { path: "/catalog/products/update/:id", element: <UpdateProduct />, handle: "Actualizar Producto" },
  { path: "/catalog/stock", element: <StockList />, handle: "Stock" },
  { path: "/catalog/stock/:id", element: <Stock />, handle: "Producto" },
  { path: "/catalog/providers", element: <Providers />, handle: "Proveedores" },
  { path: "/catalog/providers/:id", element: <Provider />, handle: "Proveedor" },
  { path: "/catalog/categories", element: <Categories />, handle: "Categorías" },
  { path: "/catalog/categories/:id", element: <Category />, handle: "Categoría" },
  { path: "/catalog/subcategory/:id", element: <Subcategory />, handle: "Subcategoría" },
];
