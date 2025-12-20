"use client"

import * as React from "react"
import {
  IconDashboard,
  IconFolder,
  IconHelp,
  IconReport,
  IconSearch,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react"

import { NavDocuments } from "@/components/dashboard/nav-documents"
import { NavMain } from "@/components/dashboard/nav-main"
import { NavSecondary } from "@/components/dashboard/nav-secondary"
import { NavUser } from "@/components/dashboard/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { CircleUserRound } from "lucide-react"

const defaultUser = {
  name: "Veridion User",
  email: "user@veridion.com",
  avatar: "/avatars/default.jpg",
};

async function fetchCurrentUser() {
  try {
    const res = await fetch("/api/user", { credentials: "include" });
    if (!res.ok) throw new Error("Failed to fetch user");
    return await res.json();
  } catch {
    return defaultUser;
  }
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [user, setUser] = React.useState(defaultUser);

  React.useEffect(() => {
    const cached = localStorage.getItem("veridion_user");
    if (cached) {
      setUser(JSON.parse(cached));
    } else {
      fetchCurrentUser().then(u => {
        setUser(u);
        localStorage.setItem("veridion_user", JSON.stringify(u));
      });
    }
  }, []);

  const data = {
    user,
    navMain: [
      { title: "Home", url: "#", icon: IconDashboard },
      { title: "Profile", url: "#", icon: IconUsers },
      { title: "Notifications", url: "#", icon: IconReport },
      { title: "Programs", url: "#", icon: IconFolder },
    ],
    navSecondary: [
      { title: "Settings", url: "#", icon: IconSettings },
      { title: "Help", url: "#", icon: IconHelp },
      { title: "Search", url: "#", icon: IconSearch },
    ],
    documents: [
      
    ],
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <a href="#">
                <CircleUserRound width={16} height={16} className="w-6 h-6 min-w-6 min-h-6 max-w-none max-h-none" />
                <span className="text-base font-semibold">Veridion Studios - Passport</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
