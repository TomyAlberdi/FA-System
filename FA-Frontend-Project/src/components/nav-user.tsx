"use client";

import { ChevronsUpDown, LogOut, ShoppingCart, User } from "lucide-react";

import { useBudgetContext } from "@/Context/Budget/UseBudgetContext";
import { useTheme } from "@/Context/theme-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Switch } from "@/components/ui/switch";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";

export function NavUser() {
  const { isMobile } = useSidebar();
  const { setTheme, theme } = useTheme();
  const { user, logout } = useKindeAuth();
  const { CurrentBudget } = useBudgetContext();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Button asChild className="w-full">
          <Link to="/sales/cart">
            <ShoppingCart />
            <span className="text-md font-semibold">Carrito</span>
            {CurrentBudget?.products?.length > 0 && (
              <span className="text-sm font-semibold rounded-full bg-destructive text-white px-2 flex justify-center items-center">
                {CurrentBudget?.products?.length}
              </span>
            )}
          </Link>
        </Button>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="sidebar-user-menu h-8 w-8 rounded-lg avatar-icon bg-sidebar-primary">
                <User color="#fff" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {user?.given_name}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {user?.given_name}
                  </span>
                  <span className="truncate text-xs">{user?.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {/*             <DropdownMenuGroup>
              <Link to={"/user"}>
                <DropdownMenuItem>
                  <Cog />
                  Usuario
                </DropdownMenuItem>
              </Link>
            </DropdownMenuGroup> */}
            <DropdownMenuGroup className="flex items-center gap-2 p-2">
              <Switch
                id="dark-mode"
                checked={theme === "dark"}
                onCheckedChange={() => {
                  setTheme(theme === "dark" ? "light" : "dark");
                }}
              />
              <Label htmlFor="dark-mode" className="text-sm">
                Modo Oscuro
              </Label>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => logout()}>
              <LogOut />
              Cerrar Sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
