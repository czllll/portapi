"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import axios from "@/lib/axios-config"
import toast from "react-hot-toast"

interface UserSettings {
  id: number
  username: string
  email: string
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<UserSettings>({
    id: 0,
    username: "",
    email: ""
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/user/current`)
      const data = await response.data.data
      console.log("usercurrent:",data)
      setSettings({
        id: data.userId,
        username: data.username,
        email: data.email
      })
    } catch (error) {
      console.error('Failed to fetch settings:', error)
      toast.error('获取用户信息失败') 
    } finally {
      setLoading(false)
    }
  }

  const handleProfileUpdate = async () => {
    try {
      await axios.put(`${process.env.NEXT_PUBLIC_BASE_API_URL}/user/${settings.id}`, settings)
      toast.success('Profile updated successfully')
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error('Failed to update profile')
    }
  }

  if (loading) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* 个人资料设置卡片 */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input 
                id="name" 
                placeholder="Your name" 
                value={settings.username}
                onChange={(e) => setSettings({ ...settings, username: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="Your email" 
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
              />
            </div>
            <Button onClick={handleProfileUpdate}>Save Changes</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}