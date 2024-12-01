'use client'
import Header from "@/components/header"
import Sidebar from "@/components/sidebar"
import useUserStore from "@/stores/useUserStore"
import { useEffect, useState } from "react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const { user, loading, error, fetchUser } = useUserStore();
  useEffect(() => { fetchUser() }, [])
  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar 
        isOpen={isSidebarOpen} 
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)} 
      />
      <div className="flex-1">
        <Header />
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
}