import { SidebarTrigger } from "@/components/ui/sidebar";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  children?: React.ReactNode;
  className?: string;
}

export function PageHeader({ title, children, className }: PageHeaderProps) {
  return (
    <div className={cn("border-b bg-background", className)}>
      <div className="container flex h-16 items-center px-4 sm:px-6">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="mr-2">
            <Menu className="h-5 w-5 text-muted-foreground transition-colors hover:text-foreground" />
          </SidebarTrigger>
          <h1 className="text-lg font-semibold sm:text-xl">{title}</h1>
        </div>
        {children && (
          <div className="ml-auto flex items-center gap-4">{children}</div>
        )}
      </div>
    </div>
  );
}
