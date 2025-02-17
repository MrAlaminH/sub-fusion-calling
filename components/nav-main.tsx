// components/nav-main.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

interface NavMainProps {
  items: {
    title: string;
    url: string;
    icon: LucideIcon;
  }[];
  collapsed?: boolean;
}

export function NavMain({ items, collapsed }: NavMainProps) {
  const pathname = usePathname();

  return (
    <div className="group flex flex-col gap-4 py-2">
      <nav className="grid gap-1">
        {items.map((item, index) => {
          const Icon = item.icon;
          const isActive = pathname === item.url;
          return (
            <Link
              key={index}
              href={item.url}
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "h-10 justify-start",
                isActive && "bg-muted font-medium",
                collapsed && "h-10 w-10 justify-center p-0"
              )}
            >
              <Icon className="h-4 w-4" />
              {!collapsed && <span className="ml-2">{item.title}</span>}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
