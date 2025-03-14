// "use client"

// import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell } from "recharts"
// import { ArrowUpRight, ArrowDownRight, Users, Package, DollarSign, TrendingUp } from "lucide-react"
// import { Card, CardContent } from "@/components/ui/card"
// import { RecentSales } from "./recent-sales"

// const monthlyData = [
//   {
//     name: "Jan",
//     total: Math.floor(Math.random() * 5000) + 1000,
//   },
//   {
//     name: "Feb",
//     total: Math.floor(Math.random() * 5000) + 1000,
//   },
//   {
//     name: "Mar",
//     total: Math.floor(Math.random() * 5000) + 1000,
//   },
//   {
//     name: "Apr",
//     total: Math.floor(Math.random() * 5000) + 1000,
//   },
//   {
//     name: "May",
//     total: Math.floor(Math.random() * 5000) + 1000,
//   },
//   {
//     name: "Jun",
//     total: Math.floor(Math.random() * 5000) + 1000,
//   },
//   {
//     name: "Jul",
//     total: Math.floor(Math.random() * 5000) + 1000,
//   },
//   {
//     name: "Aug",
//     total: Math.floor(Math.random() * 5000) + 1000,
//   },
//   {
//     name: "Sep",
//     total: Math.floor(Math.random() * 5000) + 1000,
//   },
//   {
//     name: "Oct",
//     total: Math.floor(Math.random() * 5000) + 1000,
//   },
//   {
//     name: "Nov",
//     total: Math.floor(Math.random() * 5000) + 1000,
//   },
//   {
//     name: "Dec",
//     total: Math.floor(Math.random() * 5000) + 1000,
//   },
// ]

// const categoryData = [
//   { name: "Art & Collectibles", value: 35 },
//   { name: "Electronics", value: 25 },
//   { name: "Fashion", value: 15 },
//   { name: "Home & Garden", value: 10 },
//   { name: "Jewelry", value: 15 },
// ]

// const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088fe"]

// // Calculate total revenue
// const totalRevenue = monthlyData.reduce((sum, item) => sum + item.total, 0)

// export function Overview() {
//   // Metrics data
//   const metrics = [
//     {
//       title: "Total Customers",
//       value: "3,842",
//       change: "+12.5%",
//       trend: "up",
//       icon: Users,
//     },
//     {
//       title: "Active Auctions",
//       value: "1,249",
//       change: "+8.2%",
//       trend: "up",
//       icon: Package,
//     },
//     {
//       title: "Avg. Order Value",
//       value: "$285",
//       change: "-3.1%",
//       trend: "down",
//       icon: DollarSign,
//     },
//     {
//       title: "Conversion Rate",
//       value: "3.2%",
//       change: "+0.5%",
//       trend: "up",
//       icon: TrendingUp,
//     },
//   ]

//   const CustomTooltip = ({ active, payload, label }) => {
//     if (active && payload && payload.length) {
//       return (
//         <div className="bg-background p-2 border rounded-md shadow-sm">
//           <p className="font-medium">{`${label}`}</p>
//           <p className="text-primary">{`Revenue: $${payload[0].value.toLocaleString()}`}</p>
//         </div>
//       )
//     }
//     return null
//   }

//   const PieCustomTooltip = ({ active, payload }) => {
//     if (active && payload && payload.length) {
//       return (
//         <div className="bg-background p-2 border rounded-md shadow-sm">
//           <p className="font-medium">{`${payload[0].name}`}</p>
//           <p className="text-primary">{`${payload[0].value}%`}</p>
//         </div>
//       )
//     }
//     return null
//   }

//   return (
//     <div className="p-2 md:p-6 gap-2 md:gap-0 space-y-6">
//       {/* Key Metrics */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
//         {metrics.map((metric, index) => (
//           <Card key={index}>
//             <CardContent className="p-4 flex justify-between items-center">
//               <div>
//                 <p className="text-sm text-muted-foreground">{metric.title}</p>
//                 <p className="text-2xl font-bold mt-1">{metric.value}</p>
//                 <div className="flex items-center mt-1">
//                   {metric.trend === "up" ? (
//                     <ArrowUpRight className="h-4 w-4 text-success mr-1" />
//                   ) : (
//                     <ArrowDownRight className="h-4 w-4 text-destructive mr-1" />
//                   )}
//                   <span className={metric.trend === "up" ? "text-success text-sm" : "text-destructive text-sm"}>
//                     {metric.change}
//                   </span>
//                 </div>
//               </div>
//               <div className="bg-primary/10 p-3 rounded-full">
//                 <metric.icon className="h-5 w-5 text-primary" />
//               </div>
//             </CardContent>
//           </Card>
//         ))}
//       </div>
//        <RecentSales/> 
//       {/* Charts */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Revenue Chart */}
//         <div className="rounded-xl border bg-card p-6 sm:p-4">
//           <div className="space-y-2">
//             <h3 className="text-xl font-semibold sm:text-lg">Revenue Overview</h3>
//             <div className="flex justify-between items-center">
//               <p className="text-sm text-muted-foreground sm:text-xs">Monthly revenue from all sales channels</p>
//               <p className="text-lg font-bold">${totalRevenue.toLocaleString()}</p>
//             </div>
//           </div>
//           <div className="h-[240px] sm:h-[200px] mt-4 sm:mt-2">
//             <ResponsiveContainer width="100%" height="100%">
//               <BarChart data={monthlyData}>
//                 <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
//                 <YAxis
//                   stroke="#888888"
//                   fontSize={12}
//                   tickLine={false}
//                   axisLine={false}
//                   tickFormatter={(value) => `$${value}`}
//                 />
//                 <Tooltip content={<CustomTooltip />} />
//                 <Bar dataKey="total" fill="currentColor" radius={[4, 4, 0, 0]} className="fill-primary" />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
//         </div>

//         {/* Category Distribution */}
//         <div className="rounded-xl border bg-card p-6 sm:p-4">
//           <div className="space-y-2">
//             <h3 className="text-xl font-semibold sm:text-lg">Sales by Category</h3>
//             <p className="text-sm text-muted-foreground sm:text-xs">Distribution of sales across product categories</p>
//           </div>
//           <div className="h-[240px] sm:h-[200px] mt-4 sm:mt-2 flex items-center justify-center">
//             <ResponsiveContainer width="100%" height="100%">
//               <PieChart>
//                 <Pie
//                   data={categoryData}
//                   cx="50%"
//                   cy="50%"
//                   labelLine={false}
//                   outerRadius={80}
//                   fill="#8884d8"
//                   dataKey="value"
//                   label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
//                 >
//                   {categoryData.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                   ))}
//                 </Pie>
//                 <Tooltip content={<PieCustomTooltip />} />
//                 <Legend />
//               </PieChart>
//             </ResponsiveContainer>
//           </div>
//         </div>
//       </div>

//       {/* Additional Stats */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//         <Card>
//           <CardContent className="p-4">
//             <h4 className="text-sm font-medium text-muted-foreground">Top Selling Item</h4>
//             <p className="text-lg font-semibold mt-1">Vintage Polaroid Camera</p>
//             <p className="text-sm text-muted-foreground mt-1">142 units sold this month</p>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardContent className="p-4">
//             <h4 className="text-sm font-medium text-muted-foreground">Highest Bid</h4>
//             <p className="text-lg font-semibold mt-1">Antique Gold Watch</p>
//             <p className="text-sm text-muted-foreground mt-1">$4,250 current bid</p>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardContent className="p-4">
//             <h4 className="text-sm font-medium text-muted-foreground">Customer Satisfaction</h4>
//             <p className="text-lg font-semibold mt-1">4.8/5.0</p>
//             <p className="text-sm text-muted-foreground mt-1">Based on 1,248 reviews</p>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   )
// }

"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell } from "recharts"
import { ArrowUpRight, ArrowDownRight, Users, Package, DollarSign, TrendingUp } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { RecentSales } from "./recent-sales"

const monthlyData = Array.from({ length: 12 }, (_, i) => ({
  name: new Date(0, i).toLocaleString("default", { month: "short" }),
  total: Math.floor(Math.random() * 5000) + 1000,
}))

const categoryData = [
  { name: "Art & Collectibles", value: 35 },
  { name: "Electronics", value: 25 },
  { name: "Fashion", value: 15 },
  { name: "Home & Garden", value: 10 },
  { name: "Jewelry", value: 15 },
]

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088fe"]
const totalRevenue = monthlyData.reduce((sum, item) => sum + item.total, 0)

export function Overview() {
  const metrics = [
    { title: "Total Customers", value: "3,842", change: "+12.5%", trend: "up", icon: Users },
    { title: "Active Auctions", value: "1,249", change: "+8.2%", trend: "up", icon: Package },
    { title: "Avg. Order Value", value: "$285", change: "-3.1%", trend: "down", icon: DollarSign },
    { title: "Conversion Rate", value: "3.2%", change: "+0.5%", trend: "up", icon: TrendingUp },
  ]

  return (
    <div className="p-4 space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
        {metrics.map((metric, index) => (
          <Card key={index}>
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">{metric.title}</p>
                <p className="text-2xl font-bold mt-1">{metric.value}</p>
                <div className="flex items-center mt-1">
                  {metric.trend === "up" ? (
                    <ArrowUpRight className="h-4 w-4 text-success mr-1" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-destructive mr-1" />
                  )}
                  <span className={metric.trend === "up" ? "text-success text-sm" : "text-destructive text-sm"}>
                    {metric.change}
                  </span>
                </div>
              </div>
              <div className="bg-primary/10 p-3 rounded-full">
                <metric.icon className="h-5 w-5 text-primary" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <RecentSales />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl border bg-card p-4">
          <h3 className="text-lg font-semibold">Revenue Overview</h3>
          <div className="flex justify-between text-sm text-muted-foreground">
            <p>Monthly revenue from all sales channels</p>
            <p className="text-lg font-bold">${totalRevenue.toLocaleString()}</p>
          </div>
          <div className="h-52 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                <Tooltip />
                <Bar dataKey="total" fill="#8884d8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-xl border bg-card p-4">
          <h3 className="text-lg font-semibold">Sales by Category</h3>
          <p className="text-sm text-muted-foreground">Distribution of sales across product categories</p>
          <div className="h-52 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart className="my-4">
                <Pie data={categoryData} cx="50%" cy="50%" outerRadius={80} fill="#8884d8" dataKey="value">
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <h4 className="text-sm font-medium text-muted-foreground">Top Selling Item</h4>
            <p className="text-lg font-semibold mt-1">Vintage Polaroid Camera</p>
            <p className="text-sm text-muted-foreground mt-1">142 units sold this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <h4 className="text-sm font-medium text-muted-foreground">Highest Bid</h4>
            <p className="text-lg font-semibold mt-1">Antique Gold Watch</p>
            <p className="text-sm text-muted-foreground mt-1">$4,250 current bid</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <h4 className="text-sm font-medium text-muted-foreground">Customer Satisfaction</h4>
            <p className="text-lg font-semibold mt-1">4.8/5.0</p>
            <p className="text-sm text-muted-foreground mt-1">Based on 1,248 reviews</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
