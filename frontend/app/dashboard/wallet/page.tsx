'use client'
import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Wallet, Download, Plus, AlertCircle } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'

import axios from '@/lib/axios-config'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination'

interface RechargeRecord {
  id: number
  createdAt: string
  amount: number
  paymentMethod: string
  status: string
  discountAmount?: number
  finalAmount?: number
  promoCode?: string
}

const WalletPage = () => {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_API_URL
  const [balance, setBalance] = useState(0)
  const [amount, setAmount] = useState('')
  const [promoCode, setPromoCode] = useState('')
  const [pageSize] = useState(10)
  const [total, setTotal] = useState(0)
  const [records, setRecords] = useState<RechargeRecord[]>([])
  const [currentPage, setCurrentPage] = useState(1)

  // 模型价格表
  const pricingList = [
    { model: 'GPT-4', price: '0.03/1k tokens' },
    { model: 'GPT-3.5', price: '0.005/1k tokens' },
    { model: 'Claude 3', price: '0.025/1k tokens' },
    { model: 'Gemini Pro', price: '0.01/1k tokens' }
  ]


  // 获取钱包余额
  const fetchBalance = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/wallet/balance`)
      const data = await response.data
      setBalance(data.balance)
    } catch (error) {
      console.error('Failed to fetch balance:', error)
    }
  }

  // 充值处理
  const handleTopUp = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/wallet/topup`, {
        amount: Number(amount),
        promoCode: promoCode
      })

      // 处理充值响应
      if (response.data.success) {
        fetchBalance() // 刷新余额
        setAmount('')
        setPromoCode('')
      }
    } catch (error) {
      console.error('充值失败:', error)
      // 可以添加错误提示
      // toast.error(error.response?.data?.message || '充值失败');
    }
  }

  const fetchRecords = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/wallet/records`, {
        params: {
          page: currentPage,
          size: pageSize
        }
      })
      setRecords(response.data.data.records)
      setTotal(response.data.data.total)
      setCurrentPage(currentPage)
    } catch (error) {
      console.error('获取记录失败:', error)
    }
  }

  useEffect(() => {
    fetchBalance()
    fetchRecords()
  }, [currentPage, pageSize])

  return (
    <div className='container mx-auto p-6'>
      <div className='grid grid-cols-2 gap-6 mb-6'>
        {/* 钱包余额卡片 */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center'>
              <Wallet className='mr-2' />
              钱包余额
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-3xl font-bold'>{balance} 令牌</div>
          </CardContent>
        </Card>

        <Card className='w-full'>
          <CardHeader>
            <CardTitle className='flex items-center text-xl sm:text-2xl'>
              价目表
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <AlertCircle className='h-4 w-4 ml-1 sm:h-5 sm:w-5' />
                  </TooltipTrigger>
                  <TooltipContent className='text-sm sm:text-base'>
                    <p>价格可能随时调整，具体以实际扣费为准</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4'>
              {pricingList.map((item, index) => (
                <div
                  key={index}
                  className='flex justify-between p-2 rounded-lg hover:bg-muted transition-colors'
                >
                  <span className='font-medium text-sm sm:text-base'>
                    {item.model}:
                  </span>
                  <span className='text-muted-foreground text-sm sm:text-base ml-2'>
                    {item.price}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className='flex gap-4 mb-6'>
        <Dialog>
          <DialogTrigger asChild>
            <Button className='flex-1'>
              <Plus className='mr-2' />
              充值
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>充值令牌</DialogTitle>
            </DialogHeader>
            <div className='grid gap-4 py-4'>
              <div>
                <Input
                  type='number'
                  placeholder='输入充值金额'
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  className='mb-2'
                />
                <Input
                  placeholder='输入优惠码（选填）'
                  value={promoCode}
                  onChange={e => setPromoCode(e.target.value)}
                />
              </div>
              <Button onClick={handleTopUp}>确认充值</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>充值记录</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>日期</TableHead>
                <TableHead>金额</TableHead>
                <TableHead>支付方式</TableHead>
                <TableHead>状态</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.map(record => (
                <TableRow key={record.id}>
                  <TableCell>{record.createdAt}</TableCell>
                  <TableCell>￥{record.amount}</TableCell>
                  <TableCell>{record.paymentMethod}</TableCell>
                  <TableCell>{record.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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
    </div>
  )
}

export default WalletPage
