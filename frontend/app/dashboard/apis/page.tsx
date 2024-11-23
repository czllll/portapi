"use client"

import { useEffect, useState } from "react"
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { MoreVertical } from "lucide-react"

interface Api {
  id: string
  name: string
  key: string
  status: "Active" | "Inactive"
  description: string
}

export default function ApisPage() {
  const [apis, setApis] = useState<Api[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [currentApi, setCurrentApi] = useState<Api | null>(null)
  const [newApi, setNewApi] = useState<Partial<Api>>({
    name: "",
    description: "",
    status: "Active"
  })

  useEffect(() => {
    fetchApis()
  }, [])

  const fetchApis = async () => {
    try {
      setLoading(true)
      // TODO: 调用后端获取API列表接口
      // const response = await fetch('/api/apis')
      // const data = await response.json()
      // setApis(data)
    } catch (error) {
      console.error('Failed to fetch APIs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async () => {
    try {
      // TODO: 调用后端创建API接口
      // const response = await fetch('/api/apis', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(newApi)
      // })
      // const createdApi = await response.json()
      // setApis([...apis, createdApi])
      
      setNewApi({ name: "", description: "", status: "Active" })
      setIsCreateOpen(false)
    } catch (error) {
      console.error('Failed to create API:', error)
    }
  }

  const handleEdit = async () => {
    if (!currentApi) return
    try {
      // TODO: 调用后端更新API接口
      // const response = await fetch(`/api/apis/${currentApi.id}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(currentApi)
      // })
      // const updatedApi = await response.json()
      // setApis(apis.map(api => api.id === updatedApi.id ? updatedApi : api))

      setIsEditOpen(false)
      setCurrentApi(null)
    } catch (error) {
      console.error('Failed to update API:', error)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      // TODO: 调用后端删除API接口
      // await fetch(`/api/apis/${id}`, {
      //   method: 'DELETE'
      // })
      setApis(apis.filter(api => api.id !== id))
    } catch (error) {
      console.error('Failed to delete API:', error)
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
                <label>Description</label>
                <Input
                  value={newApi.description}
                  onChange={(e) => setNewApi({ ...newApi, description: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <label>Status</label>
                <Select
                  value={newApi.status}
                  onValueChange={(value: "Active" | "Inactive") => 
                    setNewApi({ ...newApi, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
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
          <CardTitle>API Keys</CardTitle>
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
                  <TableCell>Key</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell className="w-[100px]">Actions</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {apis.map((api) => (
                  <TableRow key={api.id}>
                    <TableCell>{api.name}</TableCell>
                    <TableCell>{api.key}</TableCell>
                    <TableCell>{api.status}</TableCell>
                    <TableCell>{api.description}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              setCurrentApi(api)
                              setIsEditOpen(true)
                            }}
                          >
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDelete(api.id)}
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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
              <label>Description</label>
              <Input
                value={currentApi?.description}
                onChange={(e) =>
                  setCurrentApi(currentApi ? { ...currentApi, description: e.target.value } : null)
                }
              />
            </div>
            <div className="grid gap-2">
              <label>Status</label>
              <Select
                value={currentApi?.status}
                onValueChange={(value: "Active" | "Inactive") =>
                  setCurrentApi(currentApi ? { ...currentApi, status: value } : null)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
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
    </div>
  )
}