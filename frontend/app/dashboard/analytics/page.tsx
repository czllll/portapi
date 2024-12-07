'use client';
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import axios from "@/lib/axios-config";
  // 添加在文件开头
  interface DashboardMetrics {
    totalRequests: number;
    avgResponseTime: number;
    errorRate: number;
    totalTokens: number;
  }

  interface ApiCallTrends {
    timePoints: string[];
    requestCounts: number[];
    avgResponseTimes: number[];
    tokenSums: number[];
  }

  interface ModelStats {
    modelName: string;
    callCount: number;
    tokenUsage: number;
  }

export default function AnalyticsPage() {


  // 然后修改 useState 的类型声明
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [trends, setTrends] = useState<ApiCallTrends | null>(null);
  const [modelDistribution, setModelDistribution] = useState<ModelStats[] | null>(null);
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_API_URL



  const [timeRange, setTimeRange] = useState("7days");

  // 获取数据
  const fetchData = async () => {
    try {
      const [metricsRes, trendsRes, modelDistRes] = await Promise.all([
        axios.get(`${BASE_URL}/api-call/metrics`, {
          params: {
            timeRange
          }
        }),
        axios.get(`${BASE_URL}/api-call/trends`, {
          params: {
            timeRange
          }
        }),
        axios.get(`${BASE_URL}/api-call/model-distribution`, {
          params: {
            timeRange
          }
        })
      ]);
  
      setMetrics(metricsRes.data.data);
      setTrends(trendsRes.data.data);
      setModelDistribution(modelDistRes.data.data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [timeRange]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  // 格式化显示数字
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const metricsCards = [
    {
      title: "Total Requests",
      value: metrics?.totalRequests ? formatNumber(metrics.totalRequests) : "0",
      type: "number"
    },
    {
      title: "Avg Response Time",
      value: metrics?.avgResponseTime ? `${Math.round(metrics.avgResponseTime)}ms` : "0ms",
      type: "time"
    },
    {
      title: "Error Rate",
      value: metrics?.errorRate ? `${(metrics.errorRate * 100).toFixed(2)}%` : "0%",
      type: "percentage"
    },
    {
      title: "Total Tokens",
      value: metrics?.totalTokens ? formatNumber(metrics.totalTokens) : "0",
      type: "number"
    }
  ];

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="24h">Last 24 hours</SelectItem>
            <SelectItem value="7days">Last 7 days</SelectItem>
            <SelectItem value="30days">Last 30 days</SelectItem>
            <SelectItem value="90days">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metricsCards.map((card) => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {card.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Request Trends</CardTitle>
          </CardHeader>
          <CardContent>
            {trends && (
              <LineChart
                width={500}
                height={300}
                data={trends.timePoints.map((time, index) => ({
                  time,
                  requests: trends.requestCounts[index]
                }))}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="requests" stroke="#8884d8" />
              </LineChart>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Model Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {modelDistribution && (
              <PieChart width={500} height={300}>
                <Pie
                  data={modelDistribution}
                  dataKey="callCount"
                  nameKey="modelName"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  label
                >
                  {modelDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Response Time Trends</CardTitle>
          </CardHeader>
          <CardContent>
            {trends && (
              <LineChart
                width={500}
                height={300}
                data={trends.timePoints.map((time, index) => ({
                  time,
                  responseTime: trends.avgResponseTimes[index]
                }))}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="responseTime" stroke="#82ca9d" />
              </LineChart>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Token Usage Trends</CardTitle>
          </CardHeader>
          <CardContent>
            {trends && (
              <LineChart
                width={500}
                height={300}
                data={trends.timePoints.map((time, index) => ({
                  time,
                  tokens: trends.tokenSums[index]
                }))}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="tokens" stroke="#ffc658" />
              </LineChart>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}