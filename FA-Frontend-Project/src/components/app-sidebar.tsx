import * as React from "react";
import { Activity, ShoppingCart, UserSearch } from "lucide-react";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link } from "react-router-dom";

const data = [
  {
    title: "Catálogo",
    url: "/catalog",
    icon: ShoppingCart,
    isActive: true,
    items: [
      {
        title: "Productos",
        url: "/products",
      },
      {
        title: "Categorías",
        url: "/categories",
      },
      {
        title: "Proveedores",
        url: "/providers",
      },
      {
        title: "Stock",
        url: "/stock",
      },
    ],
  },
  {
    title: "Ventas",
    url: "/sales",
    icon: UserSearch,
    isActive: true,
    items: [
      {
        title: "Clientes",
        url: "/clients",
      },
      {
        title: "Presupuestos",
        url: "/budgets",
      }
    ],
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Activity className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">F&A S.A.</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
