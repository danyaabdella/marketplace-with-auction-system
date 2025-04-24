'use client'
import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { FilterBar } from "../filterBar"

// const orders = [
//   {
//     id: "ORD-001",
//     customer: "John Smith",
//     product: "Vintage Camera",
//     date: "2024-03-01",
//     total: 450.0,
//     status: "Completed",
//   },
//   {
//     id: "ORD-002",
//     customer: "Sarah Johnson",
//     product: "Antique Clock",
//     date: "2024-03-02",
//     total: 275.0,
//     status: "Processing",
//   },
//   {
//     id: "ORD-003",
//     customer: "Mike Brown",
//     product: "Art Print",
//     date: "2024-03-03",
//     total: 125.0,
//     status: "Shipped",
//   },
//   {
//     id: "ORD-004",
//     customer: "Emma Wilson",
//     product: "Vintage Record",
//     date: "2024-03-04",
//     total: 85.0,
//     status: "Pending",
//   },
// ]


export function OrdersPage() {
  const router = useRouter()
  const [orders, setOrders] = useState([])
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/orderFiltering')
        const data = await response.json()
        if (data.success) {
          const transformedOrders = data.orders.map(order => ({
            id: order._id.toString(),
            customer: order.customerDetail.customerName,
            product: order.products.length > 0 
              ? order.products[0].productName 
              : (order.auction ? 'Auction Item' : 'N/A'),
            date: order.orderDate,
            total: order.totalPrice,
            status: order.status,
          }))
          setOrders(transformedOrders)
        } else {
          console.error('Failed to fetch orders:', data.message)
        }
      } catch (error) {
        console.error('Error fetching orders:', error)
      }
    }
    fetchOrders()
  }, [])
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.product.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      filter === "all" || order.status.toLowerCase() === filter.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleFilterChange = (value) => {
    setFilter(value);
  };

  const filters = [
    { value: "all", label: "All Orders" },
    { value: "pending", label: "Pending Orders" },
    { value: "shipped", label: "Dispached Orders" },
    { value: "completed", label: "Recieved Orders" },
  ];
  return (
    <div className="container p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold tracking-tight">Orders</h2>
        <p className="text-muted-foreground">Manage your customer orders</p>
      </div>
      <FilterBar
        placeholder="Search orders..."
        filters={filters}
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
      />
      <div className="rounded-xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.map((order) => (
              <TableRow 
                key={order.id}
                onClick={() => router.push(`/dashboard/orders/${order.id}`)}
                className="cursor-pointer">
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>{order.customer}</TableCell>
                <TableCell>{order.product}</TableCell>
                <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                <TableCell>${order.total.toFixed(2)}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      order.status === "Recieved"
                        ? "success"
                        : order.status === "Dispached"
                          ? "default"
                          : order.status === "Pending"
                            ? "secondary"
                            : "outline"
                    }
                  >
                    {order.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

