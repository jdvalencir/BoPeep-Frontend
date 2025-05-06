'use client'
import { Calendar, Home, Inbox, Search, Settings, Folder, Brain, LucideUsersRound} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useSidebar } from "@/components/ui/sidebar"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
 
// Menu items.
const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Mis Archivos",
    url: "/home/files",
    icon: Folder,
  },
  {
    title: "Transferir de Operador",
    url: "/home/transfer",
    icon: LucideUsersRound,
  },
  {
    title: "IA Chat",
    url: "#",
    icon: Brain,
  },
]
 
export function AppSidebar() {
    const {
        state,
        open,
        setOpen,
        openMobile,
        setOpenMobile,
        isMobile,
        toggleSidebar,
      } = useSidebar()

return (
    <Sidebar collapsible="icon">
        <SidebarContent>
            <SidebarGroup className={"pr-0"}>
                <div style={{padding: '10px 20px'}}>
                    <SidebarGroupLabel className={"text-center justify-content-center align-self-center"}> 
                        <div className="text-sm text-center">
                                Barra de Herramientas
                        </div>
                    </SidebarGroupLabel> 
                </div>
                    {state == "expanded" && <hr className='border-gray-300' />}
                <SidebarGroupContent>
                    <SidebarMenu>
                        {items.map((item) => (
                            <div key={item.title}>
                                <SidebarMenuItem key={item.title} className={"pt-1"}>
                                    <SidebarMenuButton asChild className={"background-gray-100 hover:bg-gray-200 py-3 rounded-1"}>
                                        <a href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </div>
                        ))}
                    </SidebarMenu>
                </SidebarGroupContent>
            </SidebarGroup>
        </SidebarContent>
    </Sidebar>
);
}