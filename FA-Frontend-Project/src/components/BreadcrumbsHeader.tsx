import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import React from "react";
import { useLocation } from "react-router-dom";

const breadcrumbsHandles = [
  // Catalog
  { label: "catalog", handle: "Catálogo" },
  // Catalog pages
  { label: "products", handle: "Productos" },
  { label: "providers", handle: "Proveedores" },
  { label: "categories", handle: "Categorías" },
  { label: "subcategory", handle: "Subcategoría" },
  { label: "stock", handle: "Stock" },
  // Product pages
  { label: "add", handle: "Agregar" },
  { label: "update", handle: "Editar" },
  // Sales
  { label: "sales", handle: "Ventas" },
  // Sales Pages
  { label: "clients", handle: "Clientes" },
  { label: "client", handle: "Cliente" },
  { label: "budgets", handle: "Presupuestos" },
  { label: "register", handle: "Caja Registradora" },
];

export const BreadcrumbsHeader = () => {
  const location = useLocation();

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const getBreadcrumbs = () => {
    const currentPath = location.pathname
      .replace(BASE_URL, "")
      .split("/")
      .filter(Boolean);
    const breadcrumbs = currentPath.map((segment) => {
      const matchedHandle = breadcrumbsHandles.find(
        (handle) => handle.label === segment
      );
      const isId = !isNaN(Number(segment));
      const label = isId ? segment : matchedHandle?.handle || segment;
      return { label };
    });
    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbs.map((crumb, index) => (
          <React.Fragment key={index}>
            <BreadcrumbItem className="select-none">
              {crumb.label}
            </BreadcrumbItem>
            {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};
