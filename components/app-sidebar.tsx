"use client";

import * as React from "react";
import {
  AudioWaveform,
  UserPlus,
  Bot,
  Command,
  GalleryVerticalEnd,
  Settings2,
  LayoutDashboard,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";

// This is sample data.
const data = {
  user: {
    name: "Alamin H",
    email: "hello@example.com",
    avatar: "",
  },
  teams: [
    {
      name: "Fusion Calling.",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Fusion Calling.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],

  navMain: [
    {
      title: "Overview",
      url: "/overview",
      icon: LayoutDashboard,
    },
    {
      title: "Add Leads",
      url: "/add-leads",
      icon: Bot,
    },
    {
      title: "Call Logs",
      url: "/call-logs",
      icon: UserPlus,
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings2,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const sidebarContext = useSidebar() as {
    collapsed?: boolean;
  };

  const collapsed = sidebarContext.collapsed || false;

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} collapsed={collapsed} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
