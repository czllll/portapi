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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { useEffect, useState } from 'react'
import { Switch } from '@/components/ui/switch'
import { Pencil, Trash2 } from 'lucide-react'
import axios from '@/lib/axios-config'
import toast from 'react-hot-toast'
import ProtectedRoute from '@/components/protectedRoute'
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'

interface User {
  userId: number
  username: string
  email: string
  token: string | null
  avatar: string | null
  role: string
  status: number
}


export default function UsersPage () {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_API_URL
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [deleteUser, setDeleteUser] = useState<User | null>(null)
  const [total, setTotal] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${BASE_URL}/user/page`, {
        params: {
          currentPage: currentPage,
          pageSize: pageSize
        }
      })
      const pageResponse = response.data.data
      setTotal(pageResponse.total)
      setUsers(pageResponse.records)
    } catch (error) {
      console.error('Failed to fetch users:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [currentPage, pageSize])

  const handleEdit = async () => {
    if (!currentUser) return
    try {
      const response = await axios.put(
        `${BASE_URL}/user/${currentUser.userId}`,
        currentUser,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
      if (response.status === 200) {
        toast.success('用户更新成功')
        fetchUsers()
        setIsEditOpen(false)
        setCurrentUser(null)
      }
    } catch (error) {
      console.error('Failed to update user:', error)
      toast.error('用户更新失败')
    }
  }

  const handleDelete = async () => {
    if (!deleteUser?.userId) return
    try {
      const response = await axios.put(
        `${BASE_URL}/user/${deleteUser.userId}/delete`
      )
      if (response.data.code === 200) {
        toast.success('用户删除成功')
        fetchUsers()
        setIsDeleteOpen(false)
        setDeleteUser(null)
      }
    } catch (error) {
      console.error('Failed to delete user:', error)
      toast.success('用户删除失败')
    }
  }

  const handleStatusChange = async (userId: number, checked: boolean) => {
    try {
      const user = users.find(user => user.userId === userId)
      if (!user) return

      setUsers(prevUsers =>
        prevUsers.map(a =>
          a.userId === userId ? { ...a, status: checked ? 1 : 0 } : a
        )
      )

      const response = await axios.put(
        `${BASE_URL}/user/${user.userId}/status?status=${checked ? 1 : 0}`
      )
      if (response.data.code === 200) {
        toast.success('状态更新成功')
      }
    } catch (error) {
      setUsers(prevUsers =>
        prevUsers.map(a =>
          a.userId === userId ? { ...a, status: !checked ? 1 : 0 } : a
        )
      )

      console.error('Failed to update status:', error)
      toast.error('更新状态失败')
    }
  }

  return (
    <ProtectedRoute adminOnly>
      <div className='flex-1 space-y-4 p-4 md:pt-0 px-8'>
        <div className='flex items-center justify-between'>
          <h2 className='text-3xl font-bold tracking-tight'>Users</h2>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>User List</CardTitle>
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
                    <TableCell>Username</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell className='w-[140px]'>Actions</TableCell>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users?.map(user => (
                    <TableRow key={user.userId}>
                      <TableCell>{user.username}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell>
                        <Switch
                          checked={user.status === 1}
                          onCheckedChange={checked =>
                            handleStatusChange(user.userId, checked)
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <div className='flex gap-2'>
                          <Button
                            variant='outline'
                            size='sm'
                            onClick={() => {
                              setCurrentUser(user)
                              setIsEditOpen(true)
                            }}
                          >
                            <Pencil className='h-4 w-4' />
                          </Button>
                          <Button
                            variant='outline'
                            size='sm'
                            className='text-red-500 hover:text-red-500'
                            onClick={() => {
                              setDeleteUser(user)
                              setIsDeleteOpen(true)
                            }}
                          >
                            <Trash2 className='h-4 w-4' />
                          </Button>
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
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
            </DialogHeader>
            <div className='grid gap-4 py-4'>
              <div className='grid gap-2'>
                <label>Username</label>
                <Input
                  value={currentUser?.username}
                  onChange={e =>
                    setCurrentUser(
                      currentUser
                        ? { ...currentUser, username: e.target.value }
                        : null
                    )
                  }
                />
              </div>
              <div className='grid gap-2'>
                <label>Email</label>
                <Input
                  value={currentUser?.email}
                  onChange={e =>
                    setCurrentUser(
                      currentUser
                        ? { ...currentUser, email: e.target.value }
                        : null
                    )
                  }
                />
              </div>
              <div className='grid gap-2'>
                <label>Role</label>
                <Select
                  value={currentUser?.role}
                  onValueChange={value =>
                    setCurrentUser(
                      currentUser ? { ...currentUser, role: value } : null
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='user'>User</SelectItem>
                    <SelectItem value='admin'>Admin</SelectItem>
                  </SelectContent>
                </Select>
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

        <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>确认删除</AlertDialogTitle>
              <AlertDialogDescription>
                确定要删除用户 &quot;{deleteUser?.username}&quot;
                吗？此操作无法撤销。
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setDeleteUser(null)}>
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
