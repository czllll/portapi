import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  ChevronLeftIcon, 
  Settings,
  BarChartIcon,
  CodeIcon,
  CloudIcon
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const menuItems = [
  {
    title: "APIs",
    icon: CodeIcon,
    href: "/dashboard/apis"
  },
  {
    title: "Analytics", 
    icon: BarChartIcon,
    href: "/dashboard/analytics"
  },
  {
    title: "Settings",
    icon: Settings,
    href: "/dashboard/settings"
  }
];

export default function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className={cn(
      "h-[calc(100vh-4rem)] bg-background border-r transition-all duration-300",
      isOpen ? "w-64" : "w-16"
    )}>
      {/* Logo 区域 */}
      <div className="h-16 border-b flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <CloudIcon className="h-6 w-6" />
          {isOpen && (
            <Link href="/" className="font-bold text-xl">
              PortAPI
            </Link>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className={cn(
            "h-8 w-8 rounded-full bg-muted", 
            "transition-all hover:bg-muted-foreground/20",
            !isOpen && "rotate-180"
          )}
        >
          <ChevronLeftIcon className="h-5 w-5" />
        </Button>
      </div> 
      
      {/* 导航菜单 */}
      <nav className="p-2">
        {menuItems.map((item) => (
          <Link 
            key={item.href}
            href={item.href}
          >
            <Button
              variant={pathname === item.href ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start mb-1",
                !isOpen && "justify-center"
              )}
            >
              <item.icon className="h-4 w-4 mr-2" />
              {isOpen && item.title}
            </Button>
          </Link>
        ))}
      </nav>
    </aside>
  );
}