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
import { Pencil, Trash2 } from "lucide-react"
import axios from "@/lib/axios-config"
import { toast } from "react-hot-toast"

interface ModelInfo {
  id: number;
  modelId: number;
  modelName: string;
  modelCompany: string;
  modelVersion: string;
  realApiKey: string;
  status: number;
  remainQuote: number;
  isDeleted: boolean;
  createdTime: string; 
  updatedTime: string; 
}


export default function ModelsPage() {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_API_URL
  const [models, setModels] = useState<ModelInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [currentModel, setCurrentModel] = useState<ModelInfo | null>(null)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [deleteModel, setDeleteModel] = useState<ModelInfo | null>(null)
  const [newModel, setNewModel] = useState<Partial<ModelInfo>>({
    modelName: "",
    modelCompany: "",
    modelVersion: "",
    realApiKey: "",
    status: 1,
    remainQuote: 0
  })

  const fetchModels = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${BASE_URL}/model/page`, {
        params: {
          current: 1,
          size: 10
        }
      });
      const data = await response.data;
      setModels(data)
    } catch (error) {
      console.error('Failed to fetch models:', error)
      toast.error("获取模型列表失败")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchModels()
  }, [])

  const handleCreate = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/model`, newModel);
      if (response.data === true) {
        toast.success("模型创建成功")
        fetchModels()
        setNewModel({
          modelName: "",
          modelCompany: "",
          modelVersion: "",
          realApiKey: "",
          status: 1,
          remainQuote: 0
        })
        setIsCreateOpen(false)
      }
    } catch (error) {
      console.error('Failed to create model:', error)
      toast.error("模型创建失败")
    }
  }

  const handleEdit = async () => {
    if (!currentModel) return
    try {
      const response = await axios.put(`${BASE_URL}/model`, currentModel);
      if (response.data === true) {
        toast.success("模型更新成功")
        fetchModels()
        setIsEditOpen(false)
        setCurrentModel(null)
      }
    } catch (error) {
      console.error('Failed to update model:', error)
      toast.error("模型更新失败")
    }
  }

  const handleDelete = async () => {
    if (!deleteModel?.id) return
    try {
      const response = await axios.put(`${BASE_URL}/model/${deleteModel.id}/delete`);
      if (response.data === true) {
        toast.success("模型删除成功")
        fetchModels()
        setIsDeleteOpen(false)
        setDeleteModel(null)
      }
    } catch (error) {
      console.error('Failed to delete model:', error)
      toast.error("模型删除失败")
    }
  }

  const handleStatusChange = async (id: number, checked: boolean) => {
    try {
      const modelItem = models.find(m => m.id === id)
      if (!modelItem) return

      setModels(prevModels => 
        prevModels.map(m => 
          m.id === id ? { ...m, status: checked ? 1 : 0 } : m
        )
      )

      const response = await axios.put(`${BASE_URL}/model`, {
        ...modelItem,
        status: checked ? 1 : 0
      });
      
      if (response.data === true) {
        toast.success("状态更新成功")
      }
    } catch (error) {
      setModels(prevModels => 
        prevModels.map(m => 
          m.id === id ? { ...m, status: !checked ? 1 : 0 } : m
        )
      )
      console.error('Failed to update status:', error)
      toast.error("状态更新失败")
    }
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      {/* 创建Model按钮 */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Models</h2>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>Create Model</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Model</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label>Model Name</label>
                <Input
                  value={newModel.modelName}
                  onChange={(e) => setNewModel({ ...newModel, modelName: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <label>Model Company</label>
                <Input
                  value={newModel.modelCompany}
                  onChange={(e) => setNewModel({ ...newModel, modelCompany: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <label>Model Version</label>
                <Input
                  value={newModel.modelVersion}
                  onChange={(e) => setNewModel({ ...newModel, modelVersion: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <label>API Key</label>
                <Input
                  value={newModel.realApiKey}
                  onChange={(e) => setNewModel({ ...newModel, realApiKey: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <label>Remain Quote</label>
                <Input
                  type="number"
                  value={newModel.remainQuote}
                  onChange={(e) => setNewModel({ ...newModel, remainQuote: Number(e.target.value) })}
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

      {/* Model列表 */}
      <Card>
        <CardHeader>
          <CardTitle>Model List</CardTitle>
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
                  <TableCell>Model Name</TableCell>
                  <TableCell>Model Company</TableCell>
                  <TableCell>ApiKey</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>remainQuote</TableCell>
                  <TableCell className="w-[140px]">Actions</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {models.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.modelName}</TableCell>
                    <TableCell>{item.modelCompany}</TableCell>
                    <TableCell>{item.realApiKey}</TableCell>
                    <TableCell>
                      <Switch
                        checked={item.status === 1}
                        onCheckedChange={(checked) => handleStatusChange(item.id, checked)}
                      />
                    </TableCell>
                    <TableCell>{item.remainQuote}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setCurrentModel(item)
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
                            setDeleteModel(item)
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

      {/* 编辑Model对话框 */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Model</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label>Model Name</label>
              <Input
                value={currentModel?.modelName}
                onChange={(e) => 
                  setCurrentModel(currentModel ? { ...currentModel, modelName: e.target.value } : null)
                }
              />
            </div>
            <div className="grid gap-2">
              <label>Model Company</label>
              <Input
                value={currentModel?.modelCompany}
                onChange={(e) => 
                  setCurrentModel(currentModel ? { ...currentModel, modelCompany: e.target.value } : null)
                }
              />
            </div>
            <div className="grid gap-2">
              <label>Model Version</label>
              <Input
                value={currentModel?.modelVersion}
                onChange={(e) => 
                  setCurrentModel(currentModel ? { ...currentModel, modelVersion: e.target.value } : null)
                }
              />
            </div>
            <div className="grid gap-2">
              <label>API Key</label>
              <Input
                value={currentModel?.realApiKey}
                onChange={(e) => 
                  setCurrentModel(currentModel ? { ...currentModel, realApiKey: e.target.value } : null)
                }
              />
            </div>
            <div className="grid gap-2">
              <label>Remain Quote</label>
              <Input
                type="number"
                value={currentModel?.remainQuote}
                onChange={(e) => 
                  setCurrentModel(currentModel ? { ...currentModel, remainQuote: Number(e.target.value) } : null)
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

      {/* 删除确认对话框 */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              确定要删除模型 &quot;{deleteModel?.modelName}&quot; 吗？此操作无法撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteModel(null)}>取消</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>删除</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}