import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

const customers = [
  {
    id: "1",
    name: "John Smith",
    email: "john.smith@example.com",
    orders: 5,
    totalSpent: 1250.0,
    lastOrder: "2024-03-01",
    status: "Active",
    avatar: "/placeholder.svg",
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    orders: 3,
    totalSpent: 750.0,
    lastOrder: "2024-02-28",
    status: "Active",
    avatar: "/placeholder.svg",
  },
  {
    id: "3",
    name: "Mike Brown",
    email: "mike.brown@example.com",
    orders: 2,
    totalSpent: 450.0,
    lastOrder: "2024-02-25",
    status: "Inactive",
    avatar: "/placeholder.svg",
  },
  {
    id: "4",
    name: "Emma Wilson",
    email: "emma.w@example.com",
    orders: 7,
    totalSpent: 1800.0,
    lastOrder: "2024-03-02",
    status: "Active",
    avatar: "/placeholder.svg",
  },
]

export function CustomersPage() {
  return (
    <div className="container p-4 sm:p-6">
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Customers</h2>
        <p className="text-sm sm:text-base text-muted-foreground">Manage your customer relationships</p>
      </div>

      <div className="rounded-xl border bg-card overflow-hidden">
        {/* Enable horizontal scrolling on small screens */}
        <div className="overflow-x-auto">
          <Table className="w-full min-w-[600px]">
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Total Spent</TableHead>
                <TableHead>Last Order</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={customer.avatar} alt={customer.name} />
                        <AvatarFallback>{customer.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="whitespace-nowrap">
                        <div className="font-medium">{customer.name}</div>
                        <div className="text-xs sm:text-sm text-muted-foreground">{customer.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={customer.status === "Active" ? "success" : "secondary"}>{customer.status}</Badge>
                  </TableCell>
                  <TableCell className="text-center">{customer.orders}</TableCell>
                  <TableCell className="text-center">${customer.totalSpent.toFixed(2)}</TableCell>
                  <TableCell className="text-center">{new Date(customer.lastOrder).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
