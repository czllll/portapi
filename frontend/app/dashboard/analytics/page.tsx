import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const mockMetrics = [
  {
    title: "Total Requests",
    value: "2.6M",
    change: "+12.3%",
  },
  {
    title: "Avg Response Time",
    value: "185ms",
    change: "-8.1%",
  },
  {
    title: "Error Rate",
    value: "0.12%",
    change: "-3.2%",
  },
  {
    title: "Active Users",
    value: "18.5K",
    change: "+22.4%",
  },
]

export default function AnalyticsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
        <Select defaultValue="7days">
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
        {mockMetrics.map((metric) => (
          <Card key={metric.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {metric.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className={`text-xs ${
                metric.change.startsWith('+') 
                  ? 'text-green-500' 
                  : 'text-red-500'
              }`}>
                {metric.change} from last period
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Request Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          {/* 这里可以添加图表组件 */}
          <div className="h-[400px] flex items-center justify-center text-muted-foreground">
            Chart placeholder
          </div>
        </CardContent>
      </Card>
    </div>
  )
}