'use client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'

import { Input } from '@/components/ui/input'
import { useEffect, useState } from 'react'
import { Switch } from '@/components/ui/switch'
import { Pencil, Trash2, Zap } from 'lucide-react'
import axios from '@/lib/axios-config'
import { toast } from 'react-hot-toast'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import ProtectedRoute from '@/components/protectedRoute'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination'

interface ModelTemplate {
  id: number
  company: string
  modelName: string
}

interface ModelInfo {
  id: number
  modelName: string
  modelCompany: string
  realApiKey: string
  status: number
  remainQuote: number
}

export default function ModelsPage () {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_API_URL
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [total, setTotal] = useState(0)
  const [models, setModels] = useState<ModelInfo[]>([])
  const [templates, setTemplates] = useState<ModelTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedTemplate, setSelectedTemplate] =
    useState<ModelTemplate | null>(null)
  const [currentModel, setCurrentModel] = useState<ModelInfo | null>(null)
  const [deleteModel, setDeleteModel] = useState<ModelInfo | null>(null)
  const [newModel, setNewModel] = useState<Partial<ModelInfo>>({
    modelName: '',
    modelCompany: '',
    realApiKey: '',
    status: 1,
    remainQuote: 0
  })

  const fetchTemplates = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/model-template/list`)
      setTemplates(response.data)
    } catch (error) {
      console.error('Failed to fetch templates:', error)
      toast.error('获取模型模板失败')
    }
  }

  const fetchModels = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${BASE_URL}/model/page`, {
        params: {
          current: currentPage,
          size: pageSize
        }
      })
      const pageResponse = response.data.data
      setModels(pageResponse.records)
      setTotal(pageResponse.total)
    } catch (error) {
      console.error('Failed to fetch models:', error)
      toast.error('获取模型列表失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTemplates()
    fetchModels()
  }, [currentPage, pageSize])

  // 当选择模板时更新新模型信息
  const handleTemplateChange = (templateId: string) => {
    const template = templates.find(t => t.id.toString() === templateId)
    if (template) {
      setSelectedTemplate(template)
      setNewModel({
        ...newModel,
        modelCompany: template.company,
        modelName: template.modelName
      })
    }
  }

  const handleCreate = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/model`, newModel)
      if (response.data === true) {
        toast.success('模型创建成功')
        fetchModels()
        setNewModel({
          modelName: '',
          modelCompany: '',
          realApiKey: '',
          status: 1,
          remainQuote: 0
        })
        setSelectedTemplate(null)
        setIsCreateOpen(false)
      }
    } catch (error) {
      console.error('Failed to create model:', error)
      toast.error('模型创建失败')
    }
  }

  const handleEdit = async () => {
    if (!currentModel) return
    try {
      const response = await axios.put(`${BASE_URL}/model`, currentModel)
      if (response.data === true) {
        toast.success('模型更新成功')
        fetchModels()
        setIsEditOpen(false)
        setCurrentModel(null)
      }
    } catch (error) {
      console.error('Failed to update model:', error)
      toast.error('模型更新失败')
    }
  }

  const handleDelete = async () => {
    if (!deleteModel?.id) return
    try {
      const response = await axios.put(
        `${BASE_URL}/model/${deleteModel.id}/delete`
      )
      if (response.data === true) {
        toast.success('模型删除成功')
        fetchModels()
        setIsDeleteOpen(false)
        setDeleteModel(null)
      }
    } catch (error) {
      console.error('Failed to delete model:', error)
      toast.error('模型删除失败')
    }
  }

  const handleStatusChange = async (id: number, checked: boolean) => {
    try {
      const modelItem = models.find(m => m.id === id)
      if (!modelItem) return

      // 立即更新UI状态
      setModels(prevModels =>
        prevModels.map(m =>
          m.id === id ? { ...m, status: checked ? 1 : 0 } : m
        )
      )

      const response = await axios.put(`${BASE_URL}/model`, {
        ...modelItem,
        status: checked ? 1 : 0
      })

      if (response.data === true) {
        toast.success('状态更新成功')
      }
    } catch (error) {
      // 如果失败，恢复原来的状态
      setModels(prevModels =>
        prevModels.map(m =>
          m.id === id ? { ...m, status: !checked ? 1 : 0 } : m
        )
      )
      console.error('Failed to update status:', error)
      toast.error('状态更新失败')
    }
  }

  const handleTest = async (model: ModelInfo) => {
    console.log('test model: ', model)
    try {
      const response = await axios.post(`${BASE_URL}/model/test`, model)
      if (response.data.data === true) {
        toast.success(model.modelCompany + "'s API connect successful")
      } else {
        toast.error(model.modelCompany + "'s API connect failed")
      }
    } catch (error) {
      toast.error('connect failed: ' + error)
    }
  }

  return (
    <ProtectedRoute adminOnly>
      <div className='flex-1 space-y-4 p-4 md:pt-0 px-8'>
        <div className='flex items-center justify-between'>
          <h2 className='text-3xl font-bold tracking-tight'>Channels</h2>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button>Create Model</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Model</DialogTitle>
              </DialogHeader>
              <div className='grid gap-4 py-4'>
                <div className='grid gap-2'>
                  <label>Select Model Template</label>
                  <Select
                    onValueChange={handleTemplateChange}
                    value={selectedTemplate?.id.toString()}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='Select a model template' />
                    </SelectTrigger>
                    <SelectContent>
                      {templates.map(template => (
                        <SelectItem
                          key={template.id}
                          value={template.id.toString()}
                        >
                          {template.company} - {template.modelName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className='grid gap-2'>
                  <label>API Key</label>
                  <Input
                    value={newModel.realApiKey}
                    onChange={e =>
                      setNewModel({ ...newModel, realApiKey: e.target.value })
                    }
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant='outline'
                  onClick={() => setIsCreateOpen(false)}
                >
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
              <div className='flex justify-center py-8'>
                <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900'></div>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableCell className='text-center font-bold'>
                      Model Name
                    </TableCell>
                    <TableCell className='text-center font-bold'>
                      Model Company
                    </TableCell>
                    <TableCell className='text-center font-bold'>
                      ApiKey
                    </TableCell>
                    <TableCell className='text-center font-bold'>
                      Status
                    </TableCell>
                    <TableCell className='w-[140px] text-center font-bold'>
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHeader>

                <TableBody className='[&>*]:text-center'>
                  {models.map(item => (
                    <TableRow key={item.id}>
                      <TableCell>{item.modelName}</TableCell>
                      <TableCell>{item.modelCompany}</TableCell>
                      <TableCell>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                onClick={() => {
                                  navigator.clipboard.writeText(item.realApiKey)
                                  toast.success('API Key copied to clipboard')
                                }}
                                className='bg-gray-400 hover:bg-gray-500'
                              >
                                Copy to Clipboard
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent className='bg-white text-black p-2 border border-gray-300 rounded shadow-lg'>
                              <p>{item.realApiKey}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={item.status === 1}
                          onCheckedChange={checked =>
                            handleStatusChange(item.id, checked)
                          }
                        />
                      </TableCell>

                      <TableCell>
                        <div className='flex gap-2'>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant='outline'
                                  size='sm'
                                  onClick={() => {
                                    handleTest(item)
                                  }}
                                >
                                  <Zap className='h-4 w-4' />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent className='bg-white text-black p-2 border border-gray-300 rounded shadow-lg'>
                                <p>Test</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant='outline'
                                  size='sm'
                                  onClick={() => {
                                    setCurrentModel(item)
                                    setIsEditOpen(true)
                                  }}
                                >
                                  <Pencil className='h-4 w-4' />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent className='bg-white text-black p-2 border border-gray-300 rounded shadow-lg'>
                                <p>Edit</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant='outline'
                                  size='sm'
                                  className='text-red-500 hover:text-red-500'
                                  onClick={() => {
                                    setDeleteModel(item)
                                    setIsDeleteOpen(true)
                                  }}
                                >
                                  <Trash2 className='h-4 w-4' />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent className='bg-white text-black p-2 border border-gray-300 rounded shadow-lg'>
                                <p>Delete</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
            <div className='flex items-center justify-end space-x-2 py-4'>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => {
                        if (currentPage > 1) {
                          setCurrentPage(currentPage - 1)
                        }
                      }}
                      className='cursor-pointer'
                    />
                  </PaginationItem>

                  <PaginationItem>
                    <PaginationLink className='cursor-default'>
                      {currentPage} / {Math.ceil(total / pageSize)}
                    </PaginationLink>
                  </PaginationItem>

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => {
                        if (currentPage < Math.ceil(total / pageSize)) {
                          setCurrentPage(currentPage + 1)
                        }
                      }}
                      className='cursor-pointer'
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </CardContent>
        </Card>

        {/* 编辑Model对话框 */}

        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Model</DialogTitle>
            </DialogHeader>
            <div className='grid gap-4 py-4'>
              <div className='grid gap-2'>
                <label>Select Model Template</label>
                <Select
                  value={templates
                    .find(
                      t =>
                        t.company === currentModel?.modelCompany &&
                        t.modelName === currentModel?.modelName
                    )
                    ?.id.toString()}
                  onValueChange={value => {
                    const template = templates.find(
                      t => t.id.toString() === value
                    )
                    if (template && currentModel) {
                      setCurrentModel({
                        ...currentModel,
                        modelCompany: template.company,
                        modelName: template.modelName
                      })
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Select a model template' />
                  </SelectTrigger>
                  <SelectContent>
                    {templates.map(template => (
                      <SelectItem
                        key={template.id}
                        value={template.id.toString()}
                      >
                        {template.company} - {template.modelName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className='grid gap-2'>
                <label>API Key</label>
                <Input
                  value={currentModel?.realApiKey}
                  onChange={e =>
                    setCurrentModel(
                      currentModel
                        ? { ...currentModel, realApiKey: e.target.value }
                        : null
                    )
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant='outline' onClick={() => setIsEditOpen(false)}>
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
                确定要删除模型 &quot;{deleteModel?.modelName}&quot;
                吗？此操作无法撤销。
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setDeleteModel(null)}>
                取消
              </AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>删除</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </ProtectedRoute>
  )
}
