"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuGroup, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import {
  BellIcon,
  MoonIcon,
  SearchIcon,
  Settings,
  SunIcon,
  LogOutIcon,
} from "lucide-react"
import { useTheme } from "next-themes"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRouter } from "next/navigation"
import Cookies from 'js-cookie';
import axios from "@/lib/axios-config"
import toast from "react-hot-toast"

// 定义 UserProfile 接口
interface UserProfile {
  userId: number;
  username: string;
  email: string;
  token: string;
  avatar: string | null;
  role: string;
  status: string | null;
}



interface Notification {
  id: string
  unreadCount: number
}

const defaultUserProfile: UserProfile = {
  userId: 0,
  username: '',
  email: '',
  token: '',
  avatar: null,
  role: '',
  status: null
}

const defaultNotification: Notification = {
  id: "1",
  unreadCount: 0
}

export default function Header() {
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [userProfile, setUserProfile] = useState<UserProfile>(defaultUserProfile)
  const [notification, ] = useState<Notification>(defaultNotification)
  const [, setLoading] = useState(true)
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_API_URL


  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const initData = async () => {
      try {
        await Promise.all([
          fetchUserProfile(),
          fetchNotifications()
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

  const fetchNotifications = async () => {
    try {
      // TODO: 调用后端获取通知信息接口
      // const response = await fetch('/api/notifications')
      // const data = await response.json()
      // setNotification(data)
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
    }
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return
    
    try {
      // TODO: 调用后端搜索接口
      // const response = await fetch(`/api/search?q=${searchQuery}`)
      // const results = await response.json()
      // 处理搜索结果
    } catch (error) {
      console.error('Failed to perform search:', error)
    }
  }

  const handleLogout = async () => {
    try {
      //清除cookie的token
      Cookies.remove('access_token')
      localStorage.removeItem('token')
      toast.success('Logged out successfully')
      router.push('/auth/login')
    } catch (error) {
      console.error('Failed to logout:', error)
    }
  }

  if (!mounted) {
    return null
  }

  return (
    <header className="sticky top-0 z-50 w-full h-16 border-b bg-background">
      <div className="container h-full mx-auto px-4 flex items-center justify-between">
        <div className="w-32"></div>
        {/* 搜索框 */}
        <div className="flex-1 flex justify-center">
          <form onSubmit={handleSearch} className="relative w-full max-w-xl">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search..." 
              className="pl-10 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </div>

        {/* 右侧工具栏 */}
        <div className="flex items-center gap-2">
          {/* 通知按钮 */}
          <Button variant="ghost" size="icon" className="relative">
            <BellIcon className="h-5 w-5" />
            {notification.unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-600" />
            )}
          </Button>

          {/* 主题切换 */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? (
              <SunIcon className="h-5 w-5" />
            ) : (
              <MoonIcon className="h-5 w-5" />
            )}
          </Button>

          {/* 用户菜单 */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className="h-9 w-9">
                  <AvatarImage 
                    src={userProfile.avatar?userProfile.avatar:""} 
                    alt={userProfile.username} 
                  />
                  <AvatarFallback>
                    {userProfile.username[0]}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuLabel>
                {userProfile.username}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => router.push('/settings')}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="text-red-600"
                onClick={handleLogout}
              >
                <LogOutIcon className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}