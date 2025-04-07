import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Outlet, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { BreadcrumbsHeader } from "@/components/BreadcrumbsHeader";
import { Separator } from "@/components/ui/separator";

export default function Page() {
  const navigate = useNavigate();

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-start md:justify-between gap-2">
          <div className="md:hidden px-4">
            <SidebarTrigger />
          </div>
          <Separator orientation="vertical" className="md:hidden h-3/5" />
          <div className="flex items-center gap-2 px-4">
            <BreadcrumbsHeader />
          </div>
          <div className="backButtonContainer flex items-center justify-center px-4 ml-auto md:ml-0">
            <Button
              className="bg-primary rounded-md w-full"
              onClick={() => navigate(-1)}
            >
              <ChevronLeft className="large-icon" />
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
