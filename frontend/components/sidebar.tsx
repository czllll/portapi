import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  ChevronLeftIcon, 
  Settings,
  BarChartIcon,
  CodeIcon,
  CloudIcon,
  Users,
  KeySquare
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { User } from "@/types/user";
import { useEffect, useState } from "react";
import axios from "@/lib/axios-config";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}


const defaultUser: User = {
  userId: 0,
  username: '',
  email: '',
  token: '',
  avatar: null,
  role: '',
  status: null
}

const menuItems = [
  {
    title: "APIs",
    icon: CodeIcon,
    href: "/dashboard/apis",
    role: ["admin", "user"]
  },
  {
    title: "Analytics", 
    icon: BarChartIcon,
    href: "/dashboard/analytics",
    role: ["admin", "user"]

  },
  {
    title: "Users management", 
    icon: Users,
    href: "/dashboard/users-management",
    role: ["admin"]

  },
  {
    title: "Tokens",
    icon: KeySquare,
    href: "/dashboard/tokens",
    role: ["admin", "user"]
  },
  {
    title: "Settings",
    icon: Settings,
    href: "/dashboard/settings",
    role: ["admin", "user"]
  },

];

export default function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const [, setLoading] = useState(true)
  const [userProfile, setUserProfile] = useState<User>(defaultUser)
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_API_URL
  useEffect(() => {
    const initData = async () => {
      try {
        await Promise.all([
          fetchUserProfile(),
        ])
      } catch (error) {
        console.error('Failed to initialize data:', error)
      } finally {
        setLoading(false)
      }
    }

    initData()
  }, [])

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/user/current`);
      const data = response.data.data;
      setUserProfile(data)
    } catch (error) {
      console.error('Failed to fetch user profile:', error)
    }
  }

  const filteredMenuItems = menuItems.filter(item => {
    return item.role.includes(userProfile.role);
  });
  
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
        {filteredMenuItems.map((item) => (
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