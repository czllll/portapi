"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

interface UserSettings {
  name: string
  email: string
  emailNotifications: boolean
  productUpdates: boolean
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<UserSettings>({
    name: "",
    email: "",
    emailNotifications: false,
    productUpdates: false
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      setLoading(true)
      // TODO: 调用后端获取用户设置接口
      // const response = await fetch('/api/settings')
      // const data = await response.json()
      // setSettings(data)
    } catch (error) {
      console.error('Failed to fetch settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleProfileUpdate = async () => {
    try {
      // TODO: 调用后端更新用户资料接口
      // await fetch('/api/settings/profile', {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     name: settings.name,
      //     email: settings.email
      //   })
      // })
    } catch (error) {
      console.error('Failed to update profile:', error)
    }
  }

  const handleNotificationUpdate = async (key: 'emailNotifications' | 'productUpdates', value: boolean) => {
    try {
      // TODO: 调用后端更新通知设置接口
      // await fetch('/api/settings/notifications', {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ [key]: value })
      // })
      setSettings({ ...settings, [key]: value })
    } catch (error) {
      console.error('Failed to update notification settings:', error)
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
                value={settings.name}
                onChange={(e) => setSettings({ ...settings, name: e.target.value })}
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

        {/* 通知设置卡片 */}
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="email-notif">Email Notifications</Label>
              <Switch 
                id="email-notif" 
                checked={settings.emailNotifications}
                onCheckedChange={(checked) => 
                  handleNotificationUpdate('emailNotifications', checked)
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="updates">Product Updates</Label>
              <Switch 
                id="updates" 
                checked={settings.productUpdates}
                onCheckedChange={(checked) => 
                  handleNotificationUpdate('productUpdates', checked)
                }
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}