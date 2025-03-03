"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search, AlertCircle, Mail, UserX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { format } from "date-fns"

// Demo data with varied merchants and prices
const demoOrders = Array.from({ length: 20 }, (_, i) => ({
  id: `order-${i + 1}`,
  customerDetail: {
    customerId: "1",
    customerName: "John Doe",
    phoneNumber: "+1234567890",
    customerEmail: "john@example.com",
    address: {
      state: "State",
      city: "City",
    },
  },
  merchantDetail: {
    merchantId: `merchant-${Math.floor(Math.random() * 5) + 1}`,
    merchantName: `Tech Store ${Math.floor(Math.random() * 5) + 1}`,
    merchantEmail: "store@example.com",
    phoneNumber: "+1234567890",
    account_name: "Tech Store Ltd",
    account_number: "1234567890",
    bank_code: "001",
  },
  products: [
    {
      productId: "1",
      productName: "iPhone 15 Pro",
      quantity: 1,
      price: 999.99,
      delivery: "FLAT",
      deliveryPrice: 10,
    },
  ],
  totalPrice: Math.random() * 1000 + 100,
  status: ["Pending", "Dispatched", "Received"][Math.floor(Math.random() * 3)],
  paymentStatus: ["Pending", "Paid", "Paid To Merchant", "Pending Refund", "Refunded"][Math.floor(Math.random() * 5)],
  transactionRef: `TRX-${Math.random().toString(36).substr(2, 9)}`,
  orderDate: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000),
}))

// Demo user data
const demoUser = {
  id: "1",
  name: "John Doe",
  email: "john@example.com",
  role: "merchant",
  isBanned: false,
  banned: null,
  isEmailVerified: true,
  isDeleted: false,
}

const statusColors = {
  Pending: "bg-yellow-500 text-white",
  Dispatched: "bg-blue-500 text-white",
  Received: "bg-green-500 text-white",
  "Pending Refund": "bg-red-500 text-white",
  Refunded: "bg-gray-500 text-white",
  Paid: "bg-green-600 text-white",
  "Paid To Merchant": "bg-green-700 text-white",
}

function UserStatusAlert({ user }) {
  if (user.isBanned) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Account Banned</AlertTitle>
        <AlertDescription>
          Your account has been banned. Reason: {user.banned}. Please contact support for assistance.
        </AlertDescription>
      </Alert>
    )
  }

  if (user.isDeleted) {
    return (
      <Alert variant="destructive">
        <UserX className="h-4 w-4" />
        <AlertTitle>Account Deleted</AlertTitle>
        <AlertDescription>This account has been deleted and cannot access order information.</AlertDescription>
      </Alert>
    )
  }

  if (!user.isEmailVerified) {
    return (
      <Alert>
        <Mail className="h-4 w-4" />
        <AlertTitle>Email Not Verified</AlertTitle>
        <AlertDescription>Please verify your email address to access your orders.</AlertDescription>
      </Alert>
    )
  }

  return null
}

export default function OrdersPage() {
  const [user, setUser] = useState(demoUser)
  const [orders, setOrders] = useState(demoOrders)
  const [myOrders, setMyOrders] = useState([]) // Orders placed by merchant as customer
  const [filteredOrders, setFilteredOrders] = useState(demoOrders)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("all")
  const [merchantFilter, setMerchantFilter] = useState("all")
  const [minPrice, setMinPrice] = useState("")
  const [maxPrice, setMaxPrice] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [activeTab, setActiveTab] = useState("received-orders")
  const router = useRouter()

  const ITEMS_PER_PAGE = 10

  useEffect(() => {
    const fetchUserData = async () => {
      // Replace with actual API call
      // const response = await fetch('/api/user')
      // const userData = await response.json()
      // setUser(userData)
    }

    fetchUserData()
  }, [])

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user.isEmailVerified || user.isBanned || user.isDeleted) {
        setOrders([])
        setMyOrders([])
        return
      }

      // Replace with actual API calls
      if (user.role === "merchant") {
        // Fetch orders received as merchant
        // const merchantOrders = await fetch('/api/merchant/orders')
        setOrders(demoOrders)

        // Fetch orders placed as customer
        // const customerOrders = await fetch('/api/merchant/my-orders')
        setMyOrders(demoOrders.slice(0, 5)) // Demo data
      } else {
        // Fetch customer orders
        // const response = await fetch('/api/orders')
        setOrders(demoOrders)
      }
    }

    fetchOrders()
  }, [user])

  useEffect(() => {
    const ordersToFilter = activeTab === "received-orders" ? orders : myOrders
    let filtered = [...ordersToFilter]

    if (searchQuery) {
      filtered = filtered.filter(
        (order) =>
          order.customerDetail.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.transactionRef.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.merchantDetail.merchantName.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter)
    }

    if (paymentStatusFilter !== "all") {
      filtered = filtered.filter((order) => order.paymentStatus === paymentStatusFilter)
    }

    if (merchantFilter !== "all") {
      filtered = filtered.filter((order) => order.merchantDetail.merchantName === merchantFilter)
    }

    if (minPrice !== "") {
      filtered = filtered.filter((order) => order.totalPrice >= Number.parseFloat(minPrice))
    }
    if (maxPrice !== "") {
      filtered = filtered.filter((order) => order.totalPrice <= Number.parseFloat(maxPrice))
    }

    setFilteredOrders(filtered)
    setCurrentPage(1)
  }, [searchQuery, statusFilter, paymentStatusFilter, merchantFilter, minPrice, maxPrice, orders, myOrders, activeTab])

  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE)
  const displayedOrders = filteredOrders.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
  const merchants = Array.from(new Set(orders.map((order) => order.merchantDetail.merchantName)))

  if (!user.isEmailVerified || user.isBanned || user.isDeleted) {
    return (
      <div className="container py-8">
        <UserStatusAlert user={user} />
      </div>
    )
  }

  return (
    <div className="container py-8 mt-8">
      <div className="mb-8 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Orders</h1>
          {user.role === "merchant" && (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-[400px]">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="received-orders">Received Orders</TabsTrigger>
                <TabsTrigger value="my-orders">My Orders</TabsTrigger>
              </TabsList>
            </Tabs>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="relative">
            <Input
              type="search"
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10"
            />
            <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Dispatched">Dispatched</SelectItem>
              <SelectItem value="Received">Received</SelectItem>
            </SelectContent>
          </Select>

          <Select value={paymentStatusFilter} onValueChange={setPaymentStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by payment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Payment Statuses</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Paid">Paid</SelectItem>
              <SelectItem value="Paid To Merchant">Paid To Merchant</SelectItem>
              <SelectItem value="Pending Refund">Pending Refund</SelectItem>
              <SelectItem value="Refunded">Refunded</SelectItem>
            </SelectContent>
          </Select>

          {activeTab === "received-orders" && user.role === "merchant" && (
            <Select value={merchantFilter} onValueChange={setMerchantFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by merchant" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Merchants</SelectItem>
                {merchants.map((merchant) => (
                  <SelectItem key={merchant} value={merchant}>
                    {merchant}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          <Input type="number" placeholder="Min Price" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
          <Input type="number" placeholder="Max Price" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
        </div>
      </div>

      <div className="rounded-md border bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Merchant</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayedOrders.map((order, index) => (
              <TableRow
                key={order.id}
                className="transition-colors hover:bg-muted/50 cursor-pointer"
                onClick={() => router.push(`/orders/${order.id}`)}
              >
                <TableCell className="font-medium">{order.transactionRef}</TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{order.customerDetail.customerName}</p>
                    <p className="text-sm text-muted-foreground">{order.customerDetail.customerEmail}</p>
                  </div>
                </TableCell>
                <TableCell>{order.merchantDetail.merchantName}</TableCell>
                <TableCell className="font-medium">${order.totalPrice.toFixed(2)}</TableCell>
                <TableCell>
                  <Badge className={statusColors[order.status]}>{order.status}</Badge>
                </TableCell>
                <TableCell>
                  <Badge className={statusColors[order.paymentStatus]}>{order.paymentStatus}</Badge>
                </TableCell>
                <TableCell>{format(new Date(order.orderDate), "MMM d, yyyy")}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost">View</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-8 gap-2">
          <Button
            variant="outline"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </Button>
          ))}
          <Button
            variant="outline"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  )
}

