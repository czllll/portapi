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
import { CalendarIcon, Pencil, Trash2 } from "lucide-react"
import axios from "@/lib/axios-config"
import { toast } from "react-hot-toast"
import { Switch } from "@/components/ui/switch"
import React from 'react';
import MultipleSelector, { Option } from '@/components/ui/multiple-selector';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import { format, set } from "date-fns"
import useUserStore from "@/stores/useUserStore"


const MODEL_RESTRICTION_OPTIONS: Option[] = [
  { label: 'nextjs', value: 'Nextjs' },
  { label: 'Vite', value: 'vite', disable: true },
  { label: 'Nuxt', value: 'nuxt', disable: true },
  { label: 'Vue', value: 'vue, disable: true', disable: true },
  { label: 'Remix', value: 'remix' },
  { label: 'Svelte', value: 'svelte', disable: true },
  { label: 'Angular', value: 'angular', disable: true },
  { label: 'Ember', value: 'ember', disable: true },
  { label: 'React', value: 'react' },
  { label: 'Gatsby', value: 'gatsby', disable: true },
  { label: 'Astro', value: 'astro', disable: true },
];

interface Token {
  id: number
  tokenNumber: string
  name: string
  userId: number
  expiresAt: Date
  totalQuota: number
  usedQuota: number
  modelRestriction: string
  status: number
  groupId: number
  isDeleted: boolean
  createdTime: Date
  updatedTime: Date
}

export default function TokensPage() {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_API_URL
  const [tokens, setTokens] = useState<Token[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [currentToken, setCurrentToken] = useState<Token | null>(null)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [deleteToken, setDeleteToken] = useState<Token | null>(null)
  const {user} = useUserStore();
  const [newToken, setNewToken] = useState<Partial<Token>>()

  const fetchTokens = async () => {
    if (!user) return;
    try {
      setLoading(true)
      console.log("=====",user)
      const response = await axios.get(`${BASE_URL}/tokens/page`, {
        params: {
          current: 1,
          size: 10,
          userId: user?.userId
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
    if (user) {
      fetchTokens(); 
      setNewToken({
        name: "",
        expiresAt: new Date(new Date().setFullYear(new Date().getFullYear() + 100)),
        totalQuota: 1000,
        modelRestriction: "gpt-3.5-turbo",
        status: 1,
        userId: user.userId,
        groupId: 1,
      })
      console.log("====4",newToken?.expiresAt)
    }
  }, [user]);


  const handleCreate = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/tokens/create`, newToken)
      if (response.status === 200) {
        toast.success("Token创建成功")
        fetchTokens()
        setNewToken({
          name: "",
          totalQuota: 1000,
          expiresAt: new Date(new Date().setFullYear(new Date().getFullYear() + 100)),
          modelRestriction: "gpt-3.5-turbo",
          status: 1,
          groupId: 2,
          userId: user?.userId
        })
        setIsCreateOpen(false)
      }
    } catch (error) {
      console.error('Failed to create token:', error)
      toast.error("Token创建失败")
    }
  }

  const handleEdit = async () => {
    if (!currentToken) return
    try {
      const response = await axios.put(`${BASE_URL}/tokens/${currentToken.id}`, currentToken)
      if (response.status === 200) {
        toast.success("Token更新成功")
        fetchTokens()
        setIsEditOpen(false)
        setCurrentToken(null)
      }
    } catch (error) {
      console.error('Failed to update token:', error)
      toast.error("Token更新失败")
    }
  }
  
  const handleStatusChange = async (tokenId: number, checked: boolean) => {
    try {
      const token = tokens.find(token => token.id === tokenId)
      if (!token) return

      setTokens(prevTokens => 
        prevTokens.map(a => 
          a.id === tokenId ? { ...a, status: checked ? 1 : 0 } : a
        )
      )

      const response = await axios.put(
        `${BASE_URL}/tokens/${tokenId}/status?status=${checked ? 1 : 0}`
      );
      if (response.data.code === 200) {
        toast.success('状态更新成功')
      }
    } catch (error) {

      setTokens(prevTokens => 
        prevTokens.map(a => 
          a.id === tokenId ? { ...a, status: !checked ? 1 : 0 } : a
        )
      )

      console.error('Failed to update status:', error)
      toast.error('更新状态失败')
    }
  }

  const handleDelete = async () => {
    if (!deleteToken?.id) return
    
    try {
      const response = await axios.put(`${BASE_URL}/tokens/${deleteToken.id}/delete`)
      if (response.status === 200) {
        toast.success("Token删除成功")
        fetchTokens()
        setIsDeleteOpen(false)
        setDeleteToken(null)
      }
    } catch (error) {
      console.error('Failed to delete token:', error)
      toast.error("Token删除失败")
    }
  }

  //获取model列表
  const fetchModelRestrictions = async (): Promise<Option[]> => {
    try {
      const response = await fetch('/api/models/list');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching model restrictions:', error);
      return [];
    }
  };


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
                  value={newToken?.name}
                  onChange={(e) => setNewToken({ ...newToken, name: e.target.value })}
                  required
                />
              </div>
              <div className="grid gap-2">
                <label>Total Quota</label>
                <Input
                  type="number"
                  value={newToken?.totalQuota}
                  onChange={(e) => setNewToken({ ...newToken, totalQuota: parseInt(e.target.value) })}
                />
              </div>
              <div className="grid gap-2">
                <label>Model Restriction</label>
                <MultipleSelector
                  defaultOptions={MODEL_RESTRICTION_OPTIONS}
                  placeholder="Model Restriction"
                  emptyIndicator={
                    <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                      no results found.
                    </p>
                  }
                />
              </div>
              <div className="grid gap-2">
                <label>Expired Time</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[280px] justify-start text-left font-normal",
                        !newToken?.expiresAt && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon />
                      {newToken?.expiresAt ? format(newToken?.expiresAt, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={newToken?.expiresAt}
                      onSelect={(e) => {
                        setNewToken({ ...newToken, expiresAt: e }); 
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>

              </div>
              <div className="grid gap-2">
                <label>Group</label>
                <Select
                  value={newToken?.groupId === 1 ? "VIP" : "Normal"}
                  onValueChange={(value) => setNewToken({ ...newToken, groupId: value == "VIP" ? 1 : 2 })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="VIP">VIP</SelectItem>
                    <SelectItem value="Normal">Normal</SelectItem>
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
                    <TableCell>
                    <Switch
                        checked={token.status === 1}
                        onCheckedChange={(checked) => handleStatusChange(token.id, checked)}
                      />
                    </TableCell>
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
              {/* <Select
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
              </Select> */}
              <MultipleSelector
                defaultOptions={MODEL_RESTRICTION_OPTIONS}
                placeholder="Model Restriction"
                emptyIndicator={
                  <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                    no results found.
                  </p>
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
