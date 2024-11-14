import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Link, Outlet, useLocation } from "react-router-dom";
import { routesConfig } from "@/hooks/routesConfig";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

export default function Page() {
  const location = useLocation();
  const [Open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const pathSegments = location.pathname.split("/").filter(Boolean);
  console.log(pathSegments)
  const breadcrumbs = pathSegments
    .map((_, index) => {
      const path = `/${pathSegments.slice(0, index + 1).join("/")}`;
      console.log("Path: ", path);
      const route = routesConfig.find((route) => route.path === path);
      console.log("Route: ", route);
      return route ? { label: route.handle, path } : null;
    })
    .filter(Boolean);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                {breadcrumbs.length == 0 ? (
                  /* If there are no breadcrumbs, render the Home link with no separator */
                  <BreadcrumbItem>
                    <BreadcrumbLink href={"/"}>Inicio</BreadcrumbLink>
                  </BreadcrumbItem>
                ) : breadcrumbs.length == 1 ? (
                  /* If there is only one breadcrumb, render it with no separator */
                  <BreadcrumbLink href={breadcrumbs[0]?.path}>
                    {breadcrumbs[0]?.label}
                  </BreadcrumbLink>
                ) : (
                  /* If there are multiple breadcrumbs, render the first breadcrumb with a separator */
                  <>
                    <BreadcrumbItem>
                      {breadcrumbs[0] ? (
                        <BreadcrumbLink asChild>
                          <Link to={breadcrumbs[0].path}>
                            {breadcrumbs[0].label}
                          </Link>
                        </BreadcrumbLink>
                      ) : null}
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    {breadcrumbs.length > 2 ? (
                      /* If there are more than 2 breadcrumbs, render a dropdown menu */
                      <>
                        <BreadcrumbItem>
                          {isDesktop ? (
                            <DropdownMenu open={Open} onOpenChange={setOpen}>
                              <DropdownMenuTrigger
                                className="flex items-center gap-1"
                                aria-label="Toggle menu"
                              >
                                <BreadcrumbEllipsis className="h-4 w-4" />
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="start">
                                {breadcrumbs.slice(1, -1).map((item, index) => (
                                  <DropdownMenuItem key={index}>
                                    <Link to={item?.path ? item?.path : "/"}>
                                      {item?.label}
                                    </Link>
                                  </DropdownMenuItem>
                                ))}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          ) : (
                            <Drawer open={Open} onOpenChange={setOpen}>
                              <DrawerTrigger aria-label="Toggle menu">
                                <BreadcrumbEllipsis className="h-4 w-4" />
                              </DrawerTrigger>
                              <DrawerContent>
                                <DrawerHeader className="text-left">
                                  <DrawerTitle>Navegar</DrawerTitle>
                                  <DrawerDescription>
                                    Selecciona una página para continuar
                                  </DrawerDescription>
                                </DrawerHeader>
                                <div className="grid gap-1 px-4">
                                  {breadcrumbs
                                    .slice(1, -1)
                                    .map((item, index) => (
                                      <Link
                                        key={index}
                                        to={item?.path ? item?.path : "/"}
                                        className="py-1 text-sm"
                                      >
                                        {item?.label}
                                      </Link>
                                    ))}
                                </div>
                                <DrawerFooter className="pt-4">
                                  <DrawerClose asChild>
                                    <Button variant="outline">Cerrar</Button>
                                  </DrawerClose>
                                </DrawerFooter>
                              </DrawerContent>
                            </Drawer>
                          )}
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                      </>
                    ) : null}
                    <BreadcrumbItem>
                      {breadcrumbs.length > 0 &&
                      breadcrumbs[breadcrumbs.length - 1] ? (
                        <BreadcrumbLink asChild>
                          <Link
                            to={
                              breadcrumbs[breadcrumbs.length - 1]?.path || "/"
                            }
                          >
                            {breadcrumbs[breadcrumbs.length - 1]?.label}
                          </Link>
                        </BreadcrumbLink>
                      ) : null}
                    </BreadcrumbItem>
                  </>
                )}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="pageBody gap-4 p-4 pt-0">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
