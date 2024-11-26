"use client"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog" 

import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useEffect, useState } from "react"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { Pencil, Trash2 } from "lucide-react"

interface ApiInfo {
  id: number
  name: string
  url: string
  method: string
  description: string
  status: number
  headers: string
  params: string
  response: string
  createTime: string
  updateTime: string
}

export default function ApisPage() {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_API_URL
  const [apis, setApis] = useState<ApiInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [currentApi, setCurrentApi] = useState<ApiInfo | null>(null)
  const { toast } = useToast()
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [deleteApi, setDeleteApi] = useState<ApiInfo | null>(null)
  const [newApi, setNewApi] = useState<Partial<ApiInfo>>({
    name: "",
    url: "",
    method: "GET",
    description: "",
    status: 1,
    headers: "{}",
    params: "{}",
    response: "{}"
  })

  const fetchApis = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${BASE_URL}/api-info/page?current=1&size=10`)
      const data = await response.json()
      setApis(data.records)
    } catch (error) {
      console.error('Failed to fetch APIs:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchApis()
  }, [])

  const handleCreate = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api-info`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newApi)
      })
      if (response.ok) {
        toast({
          description: "API创建成功",
        })
        fetchApis()
        setNewApi({
          name: "",
          url: "",
          method: "GET",
          description: "",
          status: 1,
          headers: "{}",
          params: "{}",
          response: "{}"
        })
        setIsCreateOpen(false)
      }
    } catch (error) {
      console.error('Failed to create API:', error)
      toast({
        variant: "destructive",
        description: "API创建失败",
      })
    }
  }

  const handleEdit = async () => {
    if (!currentApi) return
    try {
      const response = await fetch(`${BASE_URL}/api-info`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentApi)
      })
      if (response.ok) {
        toast({
          description: "API更新成功",
        })
        fetchApis()
        setIsEditOpen(false)
        setCurrentApi(null)
      }
    } catch (error) {
      console.error('Failed to update API:', error)
      toast({
        variant: "destructive",
        description: "API更新失败",
      })
    }
  }
  
  const handleDelete = async () => {
    if (!deleteApi?.id) return
    
    try {
      const response = await fetch(`${BASE_URL}/api-info/${deleteApi.id}`, {
        method: 'DELETE'
      })
      if (response.ok) {
        toast({
          description: "API删除成功",
        })
        fetchApis()
        setIsDeleteOpen(false)
        setDeleteApi(null)
      }
    } catch (error) {
      console.error('Failed to delete API:', error)
      toast({
        variant: "destructive",
        description: "API删除失败",
      })
    }
  }
  
  const handleStatusChange = async (id: number, checked: boolean) => {
    try {
      const api = apis.find(api => api.id === id)
      if (!api) return
  
      const response = await fetch(`${BASE_URL}/api-info`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...api,
          status: checked ? 1 : 0
        })
      })
      if (response.ok) {
        toast({
          description: "状态更新成功",
        })
        fetchApis()
      }
    } catch (error) {
      console.error('Failed to update status:', error)
      toast({
        variant: "destructive",
        description: "状态更新失败",
      })
    }
  }


  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      {/* 创建API按钮 */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">APIs</h2>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>Create API</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New API</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label>Name</label>
                <Input
                  value={newApi.name}
                  onChange={(e) => setNewApi({ ...newApi, name: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <label>URL</label>
                <Input
                  value={newApi.url}
                  onChange={(e) => setNewApi({ ...newApi, url: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <label>Method</label>
                <Select
                  value={newApi.method}
                  onValueChange={(value) => setNewApi({ ...newApi, method: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GET">GET</SelectItem>
                    <SelectItem value="POST">POST</SelectItem>
                    <SelectItem value="PUT">PUT</SelectItem>
                    <SelectItem value="DELETE">DELETE</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <label>Description</label>
                <Input
                  value={newApi.description}
                  onChange={(e) => setNewApi({ ...newApi, description: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreate}>Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* API列表 */}
      <Card>
        <CardHeader>
          <CardTitle>API List</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>URL</TableCell>
                  <TableCell>Method</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell className="w-[140px]">Actions</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {apis.map((api) => (
                  <TableRow key={api.id}>
                    <TableCell>{api.name}</TableCell>
                    <TableCell>{api.url}</TableCell>
                    <TableCell>{api.method}</TableCell>
                    <TableCell>
                      <Switch
                        checked={api.status === 1}
                        onCheckedChange={(checked) => handleStatusChange(api.id, checked)}
                      />
                    </TableCell>
                    <TableCell>{api.description}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setCurrentApi(api)
                            setIsEditOpen(true)
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-500 hover:text-red-500"
                          onClick={() => {
                            setDeleteApi(api)
                            setIsDeleteOpen(true)
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
          )}
        </CardContent>
      </Card>

      {/* 编辑API对话框 */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit API</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label>Name</label>
              <Input
                value={currentApi?.name}
                onChange={(e) => 
                  setCurrentApi(currentApi ? { ...currentApi, name: e.target.value } : null)
                }
              />
            </div>
            <div className="grid gap-2">
              <label>URL</label>
              <Input
                value={currentApi?.url}
                onChange={(e) => 
                  setCurrentApi(currentApi ? { ...currentApi, url: e.target.value } : null)
                }
              />
            </div>
            <div className="grid gap-2">
              <label>Method</label>
              <Select
                value={currentApi?.method}
                onValueChange={(value) =>
                  setCurrentApi(currentApi ? { ...currentApi, method: value } : null)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GET">GET</SelectItem>
                  <SelectItem value="POST">POST</SelectItem>
                  <SelectItem value="PUT">PUT</SelectItem>
                  <SelectItem value="DELETE">DELETE</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <label>Description</label>
              <Input
                value={currentApi?.description}
                onChange={(e) =>
                  setCurrentApi(currentApi ? { ...currentApi, description: e.target.value } : null)
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              确定要删除API &quot;{deleteApi?.name}&quot; 吗？此操作无法撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteApi(null)}>取消</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>删除</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}