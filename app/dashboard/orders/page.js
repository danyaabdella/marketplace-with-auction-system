import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

const orders = [
  {
    id: "ORD-001",
    customer: "John Smith",
    product: "Vintage Camera",
    date: "2024-03-01",
    total: 450.0,
    status: "Completed",
  },
  {
    id: "ORD-002",
    customer: "Sarah Johnson",
    product: "Antique Clock",
    date: "2024-03-02",
    total: 275.0,
    status: "Processing",
  },
  {
    id: "ORD-003",
    customer: "Mike Brown",
    product: "Art Print",
    date: "2024-03-03",
    total: 125.0,
    status: "Shipped",
  },
  {
    id: "ORD-004",
    customer: "Emma Wilson",
    product: "Vintage Record",
    date: "2024-03-04",
    total: 85.0,
    status: "Pending",
  },
]

export default function OrdersPage() {
  return (
    <div className="container p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold tracking-tight">Orders</h2>
        <p className="text-muted-foreground">Manage your customer orders</p>
      </div>

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
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>{order.customer}</TableCell>
                <TableCell>{order.product}</TableCell>
                <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                <TableCell>${order.total.toFixed(2)}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      order.status === "Completed"
                        ? "success"
                        : order.status === "Processing"
                          ? "default"
                          : order.status === "Shipped"
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

