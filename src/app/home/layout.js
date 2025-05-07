import { AppSidebar } from "@/components/sideBar/page";
import { Separator } from "@/components/ui/separator";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import Header from "@/components/header/page";

export default function RootLayout({ children }) {
  return (
    <SidebarProvider>
      {/* Sidebar */}
      <SidebarInset>
        <div className="flex flex-row justify-start">
          <AppSidebar />
          {/* Contenido */}
          <div className="w-full">
            <header className="flex shrink-0 items-center gap-2 border-b bg-gray-200">
              <div className="flex flex-fill justify-between items-center gap-2 px-3 w-full scroll">
                <div className="flex items-center gap-2">
                  <SidebarTrigger />
                  <Separator
                    orientation="vertical"
                    className="h-1 bg-gray-200"
                  />
                </div>
                <Header className="flex-grow" />
              </div>
            </header>
            <main className="flex-1">{children}</main>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
