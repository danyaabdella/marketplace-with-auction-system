"use client"

import { useState } from "react"
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  Pie,
  PieChart,
  Area,
  AreaChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  Cell,
  RadialBarChart,
  RadialBar,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
// import { CalendarDateRangePicker } from "@/components/ui/date-range-picker"
import { DollarSign, Users, Gavel, Activity, ArrowUp, ArrowDown } from "lucide-react"
// import { Progress } from "@/components/ui/progress"

// Sample data - Replace with real API data
const revenueData = [
  { name: "Jan", total: 4500, auctions: 2500, direct: 2000, customers: 120 },
  { name: "Feb", total: 3500, auctions: 1800, direct: 1700, customers: 150 },
  { name: "Mar", total: 6000, auctions: 3500, direct: 2500, customers: 180 },
  { name: "Apr", total: 5200, auctions: 2800, direct: 2400, customers: 200 },
  { name: "May", total: 7800, auctions: 4200, direct: 3600, customers: 220 },
  { name: "Jun", total: 8200, auctions: 4500, direct: 3700, customers: 250 },
  { name: "Jul", total: 7000, auctions: 3800, direct: 3200, customers: 280 },
  { name: "Aug", total: 9200, auctions: 5000, direct: 4200, customers: 310 },
  { name: "Sep", total: 8500, auctions: 4600, direct: 3900, customers: 340 },
  { name: "Oct", total: 7800, auctions: 4200, direct: 3600, customers: 360 },
  { name: "Nov", total: 8900, auctions: 4800, direct: 4100, customers: 390 },
  { name: "Dec", total: 9500, auctions: 5200, direct: 4300, customers: 420 },
]

const categoryData = [
  { name: "Electronics", value: 35, revenue: 15000, growth: 25 },
  { name: "Fashion", value: 25, revenue: 12000, growth: 15 },
  { name: "Home", value: 20, revenue: 9000, growth: 20 },
  { name: "Sports", value: 15, revenue: 7000, growth: 10 },
  { name: "Others", value: 5, revenue: 2000, growth: 5 },
]

const geographicData = [
  { name: "North", value: 32 },
  { name: "South", value: 28 },
  { name: "East", value: 22 },
  { name: "West", value: 18 },
]

const auctionMetrics = [
  { name: "Success Rate", value: 85 },
  { name: "Participation", value: 72 },
  { name: "Repeat Bidders", value: 63 },
  { name: "New Bidders", value: 45 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"]

export function DashboardOverview() {
  const [timeframe, setTimeframe] = useState("year")

  return (
    <div className="flex-1 space-y-6 p-8">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Merchant Dashboard</h2>
          <p className="text-muted-foreground">Comprehensive overview of your business performance</p>
        </div>
        <div className="flex items-center space-x-4">
          <Tabs defaultValue={timeframe} onValueChange={setTimeframe}>
            <TabsList>
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="month">Month</TabsTrigger>
              <TabsTrigger value="year">Year</TabsTrigger>
            </TabsList>
          </Tabs>
          {/* <CalendarDateRangePicker /> */}
          <Button>Export Report</Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline space-x-3">
              <div className="text-2xl font-bold">$86,431.89</div>
              <div className="flex items-center text-sm text-green-500">
                <ArrowUp className="h-4 w-4" />
                20.1%
              </div>
            </div>
            <p className="text-xs text-muted-foreground">+$12,311 from last month</p>
            <div className="mt-4 h-[60px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData}>
                  <Line type="monotone" dataKey="total" stroke="#0ea5e9" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Auctions</CardTitle>
            <Gavel className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline space-x-3">
              <div className="text-2xl font-bold">573</div>
              <div className="flex items-center text-sm text-green-500">
                <ArrowUp className="h-4 w-4" />
                12.5%
              </div>
            </div>
            <p className="text-xs text-muted-foreground">201 ending in 24 hours</p>
            <div className="mt-4 h-[60px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <Area type="monotone" dataKey="auctions" stroke="#10b981" fill="#10b981" fillOpacity={0.2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customer Growth</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline space-x-3">
              <div className="text-2xl font-bold">2,350</div>
              <div className="flex items-center text-sm text-green-500">
                <ArrowUp className="h-4 w-4" />
                18.2%
              </div>
            </div>
            <p className="text-xs text-muted-foreground">+180 new this month</p>
            <div className="mt-4 h-[60px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData.slice(-6)}>
                  <Bar dataKey="customers" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Auction Success Rate</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline space-x-3">
              <div className="text-2xl font-bold">85.7%</div>
              <div className="flex items-center text-sm text-red-500">
                <ArrowDown className="h-4 w-4" />
                2.1%
              </div>
            </div>
            <p className="text-xs text-muted-foreground">-1.2% from last week</p>
            <div className="mt-4">
              {/* <Progress value={85.7} className="h-2" /> */}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Revenue Breakdown */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Revenue Breakdown</CardTitle>
            <CardDescription>Comparison of auction and direct sales revenue over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="auctions" stackId="revenue" fill="#0ea5e9" name="Auction Sales" />
                  <Bar dataKey="direct" stackId="revenue" fill="#8b5cf6" name="Direct Sales" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Category Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Category Performance</CardTitle>
            <CardDescription>Revenue distribution by product category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart outerRadius={90} data={categoryData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="name" />
                  <PolarRadiusAxis angle={30} domain={[0, 40]} />
                  <Radar name="Value" dataKey="value" stroke="#0ea5e9" fill="#0ea5e9" fillOpacity={0.6} />
                  <Radar name="Growth" dataKey="growth" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Geographic Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Geographic Distribution</CardTitle>
            <CardDescription>Sales distribution by region</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={geographicData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {geographicData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Auction Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Auction Performance Metrics</CardTitle>
            <CardDescription>Key auction success indicators</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart innerRadius="10%" outerRadius="80%" data={auctionMetrics} startAngle={180} endAngle={0}>
                  <RadialBar
                    minAngle={15}
                    label={{ fill: "#666", position: "insideStart" }}
                    background
                    clockWise={true}
                    dataKey="value"
                  />
                  <Legend
                    iconSize={10}
                    width={120}
                    height={140}
                    layout="vertical"
                    verticalAlign="middle"
                    align="right"
                  />
                  <Tooltip />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Trends */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Monthly Performance Trends</CardTitle>
            <CardDescription>Revenue and customer growth over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="total" stroke="#0ea5e9" name="Total Revenue" />
                  <Line yAxisId="right" type="monotone" dataKey="customers" stroke="#10b981" name="Customer Growth" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

