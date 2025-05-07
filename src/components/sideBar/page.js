'use client'
import { Calendar, Home, Inbox, Search, Settings, Folder, Brain, LucideUsersRound} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useSidebar } from "@/components/ui/sidebar"
import Image from "next/image"

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
    title: "Mis Archivos",
    url: "/home",
    icon: Home,
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
        <SidebarContent className={'bg-gray-200'}>
            <SidebarGroup className={"pr-0 pl-0"}>
            <div className={`py-[0.6rem] ${state === 'expanded' ? 'border-b-3': ''} border-gray-300 flex items-center `}>
                <SidebarGroupLabel className={"text-center w-full"}> 
                    <div className="flex gap-x-2 text-sm items-center justify-center">
                        <Image src="/logo/logo.png" alt="Logo" width={40} height={40} />
                        {state === "expanded" && <h1 className="font-bold">Operador Marcianos</h1>}
                    </div>
                </SidebarGroupLabel> 
            </div>
                <SidebarGroupContent>
                    <SidebarMenu>
                        {state !== "expanded" ? 
                        <SidebarMenuItem className={"pt-1 pl-1"}>
                            <SidebarMenuButton asChild className={"background-gray-100 pointer-events-none py-3 rounded-1"}>
                            <div>
                                <Image src="/logo/logo.png" alt="Logo" width={40} height={40} />
                            </div>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        : null}                        
                        {items.map((item) => (
                            <div key={item.title}>
                                <SidebarMenuItem key={item.title} className={"pt-1 pl-1"}>
                                    <SidebarMenuButton asChild className={"background-gray-100 hover:bg-gray-100 py-3 rounded-1"}>
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