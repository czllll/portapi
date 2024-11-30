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
import { useToast } from "@/hooks/use-toast"
import { Pencil, Trash2 } from "lucide-react"
import axios from "@/lib/axios-config"

interface Token {
  id: number
  tokenNumber: string
  name: string
  userId: number
  expiresAt: string
  totalQuota: number
  usedQuota: number
  modelRestriction: string
  status: string
  groupId: number
  isDeleted: boolean
  createdTime: string
  updatedTime: string
}

export default function TokensPage() {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_API_URL
  const [tokens, setTokens] = useState<Token[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [currentToken, setCurrentToken] = useState<Token | null>(null)
  const { toast } = useToast()
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [deleteToken, setDeleteToken] = useState<Token | null>(null)
  const [newToken, setNewToken] = useState<Partial<Token>>({
    name: "",
    totalQuota: 1000,
    modelRestriction: "gpt-3.5-turbo",
    status: "active",
    groupId: 1,
  })

  const fetchTokens = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${BASE_URL}/tokens/page`, {
        params: {
          current: 1,
          size: 10
        }
      });
        setTokens(response.data.data)    
    } catch (error) {
      console.error('Failed to fetch tokens:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTokens()
  }, [])

  const handleCreate = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/tokens`, newToken)
      if (response.status === 200) {
        toast({
          description: "Token创建成功",
        })
        fetchTokens()
        setNewToken({
          name: "",
          totalQuota: 1000,
          modelRestriction: "gpt-3.5-turbo",
          status: "active",
          groupId: 1,
        })
        setIsCreateOpen(false)
      }
    } catch (error) {
      console.error('Failed to create token:', error)
      toast({
        variant: "destructive",
        description: "Token创建失败",
      })
    }
  }

  const handleEdit = async () => {
    if (!currentToken) return
    try {
      const response = await axios.put(`${BASE_URL}/tokens/${id}`, currentToken)
      if (response.status === 200) {
        toast({
          description: "Token更新成功",
        })
        fetchTokens()
        setIsEditOpen(false)
        setCurrentToken(null)
      }
    } catch (error) {
      console.error('Failed to update token:', error)
      toast({
        variant: "destructive",
        description: "Token更新失败",
      })
    }
  }
  
  const handleDelete = async () => {
    if (!deleteToken?.id) return
    
    try {
      const response = await axios.delete(`${BASE_URL}/tokens/${deleteToken.id}`)
      if (response.status === 200) {
        toast({
          description: "Token删除成功",
        })
        fetchTokens()
        setIsDeleteOpen(false)
        setDeleteToken(null)
      }
    } catch (error) {
      console.error('Failed to delete token:', error)
      toast({
        variant: "destructive",
        description: "Token删除失败",
      })
    }
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Tokens</h2>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>Create Token</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Token</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label>Name</label>
                <Input
                  value={newToken.name}
                  onChange={(e) => setNewToken({ ...newToken, name: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <label>Total Quota</label>
                <Input
                  type="number"
                  value={newToken.totalQuota}
                  onChange={(e) => setNewToken({ ...newToken, totalQuota: parseInt(e.target.value) })}
                />
              </div>
              <div className="grid gap-2">
                <label>Model Restriction</label>
                <Select
                  value={newToken.modelRestriction}
                  onValueChange={(value) => setNewToken({ ...newToken, modelRestriction: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gpt-3.5-turbo">GPT-3.5-Turbo</SelectItem>
                    <SelectItem value="gpt-4">GPT-4</SelectItem>
                    <SelectItem value="gpt-3.5-turbo,gpt-4">Both</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <label>Group ID</label>
                <Input
                  type="number"
                  value={newToken.groupId}
                  onChange={(e) => setNewToken({ ...newToken, groupId: parseInt(e.target.value) })}
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

      <Card>
        <CardHeader>
          <CardTitle>Token List</CardTitle>
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
                  <TableCell>Token Number</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Quota</TableCell>
                  <TableCell>Model Restriction</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Expires At</TableCell>
                  <TableCell className="w-[140px]">Actions</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tokens.map((token) => (
                  <TableRow key={token.id}>
                    <TableCell>{token.tokenNumber}</TableCell>
                    <TableCell>{token.name}</TableCell>
                    <TableCell>{token.usedQuota}/{token.totalQuota}</TableCell>
                    <TableCell>{token.modelRestriction}</TableCell>
                    <TableCell>{token.status}</TableCell>
                    <TableCell>{new Date(token.expiresAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setCurrentToken(token)
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
                            setDeleteToken(token)
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

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Token</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label>Name</label>
              <Input
                value={currentToken?.name}
                onChange={(e) => 
                  setCurrentToken(currentToken ? { ...currentToken, name: e.target.value } : null)
                }
              />
            </div>
            <div className="grid gap-2">
              <label>Total Quota</label>
              <Input
                type="number"
                value={currentToken?.totalQuota}
                onChange={(e) =>
                  setCurrentToken(currentToken ? { ...currentToken, totalQuota: parseInt(e.target.value) } : null)
                }
              />
            </div>
            <div className="grid gap-2">
              <label>Model Restriction</label>
              <Select
                value={currentToken?.modelRestriction}
                onValueChange={(value) =>
                  setCurrentToken(currentToken ? { ...currentToken, modelRestriction: value } : null)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt-3.5-turbo">GPT-3.5-Turbo</SelectItem>
                  <SelectItem value="gpt-4">GPT-4</SelectItem>
                  <SelectItem value="gpt-3.5-turbo,gpt-4">Both</SelectItem>
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

      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              确定要删除Token &quot;{deleteToken?.name}&quot; 吗？此操作无法撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteToken(null)}>取消</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>删除</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
