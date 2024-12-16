import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider
} from "@/components/ui/sidebar";
import { Outlet, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { BreadcrumbsHeader } from "@/components/BreadcrumbsHeader";

export default function Page() {

  const navigate = useNavigate();

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between gap-2">
          <div className="flex items-center gap-2 px-4">
{/*             <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" /> */}
            <BreadcrumbsHeader />
          </div>
          <div className="backButtonContainer flex items-center justify-center px-4">
            <Button
              className="bg-primary rounded-md text-lg w-full"
              onClick={() => navigate(-1)}
            >
              <ChevronLeft size={30} />
              Volver
            </Button>
          </div>
        </header>
        <div className="pageBody gap-4 p-4 pt-0">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
