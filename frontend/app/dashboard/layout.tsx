// DashboardLayout.tsx
'use client'
import Header from "@/components/header"
import Sidebar from "@/components/sidebar"
import useUserStore from "@/stores/useUserStore"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isSmallScreen, setIsSmallScreen] = useState(false)
  const { fetchUser } = useUserStore()

  useEffect(() => {
    const handleResize = () => {
      const isSmall = window.innerWidth < 768
      setIsSmallScreen(isSmall)
      setIsSidebarOpen(!isSmall)
    }

    handleResize()

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    fetchUser()
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        isSmallScreen={isSmallScreen}
      />
      <div className={cn(
        "transition-all duration-300 ease-in-out",
        isSidebarOpen ? "ml-64" : "ml-16"
      )}>
        <Header />
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
}