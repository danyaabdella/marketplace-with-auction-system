"use client"

import { Bar, BarChart, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

const data = [
  {
    name: "Jan",
    total: Math.floor(Math.random() * 5000) + 1000,
    auction: Math.floor(Math.random() * 3000) + 500,
    direct: Math.floor(Math.random() * 2000) + 500,
  },
  {
    name: "Feb",
    total: Math.floor(Math.random() * 5000) + 1000,
    auction: Math.floor(Math.random() * 3000) + 500,
    direct: Math.floor(Math.random() * 2000) + 500,
  },
  {
    name: "Mar",
    total: Math.floor(Math.random() * 5000) + 1000,
    auction: Math.floor(Math.random() * 3000) + 500,
    direct: Math.floor(Math.random() * 2000) + 500,
  },
  {
    name: "Apr",
    total: Math.floor(Math.random() * 5000) + 1000,
    auction: Math.floor(Math.random() * 3000) + 500,
    direct: Math.floor(Math.random() * 2000) + 500,
  },
  {
    name: "May",
    total: Math.floor(Math.random() * 5000) + 1000,
    auction: Math.floor(Math.random() * 3000) + 500,
    direct: Math.floor(Math.random() * 2000) + 500,
  },
  {
    name: "Jun",
    total: Math.floor(Math.random() * 5000) + 1000,
    auction: Math.floor(Math.random() * 3000) + 500,
    direct: Math.floor(Math.random() * 2000) + 500,
  },
  {
    name: "Jul",
    total: Math.floor(Math.random() * 5000) + 1000,
    auction: Math.floor(Math.random() * 3000) + 500,
    direct: Math.floor(Math.random() * 2000) + 500,
  },
]

export function Overview() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
        />
        <Bar
          dataKey="auction"
          fill="currentColor"
          radius={[4, 4, 0, 0]}
          className="fill-primary"
        />
        <Bar
          dataKey="direct"
          fill="currentColor"
          radius={[4, 4, 0, 0]}
          className="fill-blue-500"
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
