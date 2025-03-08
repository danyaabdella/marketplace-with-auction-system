"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {CreateAuctionDialog} from "./create-auction";
import { FilterBar } from "../filterBar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/libs/utils";
import { Edit, MoreHorizontal, Plus, Trash } from "lucide-react";
import { useToast } from "../ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { EditAuctionForm } from "./editAuctionForm";

const auctions = [
  {
    id: "1",
    productId: "prod1",
    productName: "Vintage Polaroid Camera",
    merchantId: "merch1",
    description: "Original Polaroid camera from the 1970s in excellent condition.",
    condition: "used",
    startTime: "2024-03-10T10:00:00Z",
    endTime: "2024-03-15T10:00:00Z",
    itemImg: ["/placeholder.svg"],
    startingPrice: 120.0,
    reservedPrice: 200.0,
    bidIncrement: 10.0,
    status: "active",
    adminApproval: "approved",
    paymentduration: "2024-03-17T10:00:00Z",
    quantity: 1,
    currentBid: 150.0,
    bids: 8,
  },
  {
    id: "2",
    productId: "prod2",
    productName: "Antique Wooden Desk",
    merchantId: "merch1",
    description: "Beautiful oak desk from the early 20th century.",
    condition: "used",
    startTime: "2024-03-05T10:00:00Z",
    endTime: "2024-03-10T10:00:00Z",
    itemImg: ["/placeholder.svg"],
    startingPrice: 350.0,
    reservedPrice: 500.0,
    bidIncrement: 25.0,
    status: "ended",
    adminApproval: "approved",
    paymentduration: "2024-03-12T10:00:00Z",
    quantity: 1,
    currentBid: 525.0,
    bids: 12,
  },
  {
    id: "3",
    productId: "prod3",
    productName: "Limited Edition Vinyl",
    merchantId: "merch1",
    description: "Rare first pressing of a classic album, still sealed.",
    condition: "new",
    startTime: "2024-03-15T10:00:00Z",
    endTime: "2024-03-20T10:00:00Z",
    itemImg: ["/placeholder.svg"],
    startingPrice: 75.0,
    reservedPrice: 150.0,
    bidIncrement: 5.0,
    status: "active",
    adminApproval: "pending",
    paymentduration: null,
    quantity: 1,
    currentBid: 75.0,
    bids: 0,
  },
  {
    id: "4",
    productId: "prod4",
    productName: "Art Deco Lamp",
    merchantId: "merch1",
    description: "Original Art Deco lamp with stained glass shade.",
    condition: "used",
    startTime: "2024-03-20T10:00:00Z",
    endTime: "2024-03-25T10:00:00Z",
    itemImg: ["/placeholder.svg"],
    startingPrice: 220.0,
    reservedPrice: 300.0,
    bidIncrement: 15.0,
    status: "active",
    adminApproval: "rejected",
    paymentduration: null,
    quantity: 1,
    currentBid: 0,
    bids: 0,
  },
];

export function MerchantAuctions() {
  const router = useRouter()
  const { toast } = useToast()
  const [sortColumn, setSortColumn] = useState(null)
  const [sortDirection, setSortDirection] = useState("asc")
  const [isCreateAuctionOpen, setIsCreateAuctionOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedAuction, setSelectedAuction] = useState(null)
  const [isEditAuctionOpen, setIsEditAuctionOpen] = useState(false)
  const [auctionToEdit, setAuctionToEdit] = useState(null)
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [approvalFilter, setApprovalFilter] = useState("all");
  

  const filteredAuctions = auctions.filter((auction) => {
    const matchesSearch = auction.productName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || auction.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesApproval =
      approvalFilter === "all" || auction.adminApproval.toLowerCase() === approvalFilter.toLowerCase();
    return matchesSearch && matchesStatus && matchesApproval;
  });

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleStatusFilterChange = (value) => {
    setStatusFilter(value);
  };
  const handleApprovalFilterChange = (value) => {
    setApprovalFilter(value);
  };

  const statusFilters = [
    { value: "all", label: "All Statuses" },
    { value: "active", label: "Active" },
    { value: "cancelled", label: "Cancelled" },
    { value: "ended", label: "Ended" },
  ];

  const approvalFilters = [
    { value: "all", label: "All" },
    { value: "pending", label: "Pending" },
    { value: "rejected", label: "Rejected" },
    { value: "approved", label: "Approved" },
  ];
  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };
  const handleAuctionClick = (auction) => {
    router.push(`/dashboard/auctions/${auction.id}`)
  }

  // const handleCreateAuction = () => {
  //   setIsCreateAuctionOpen(true)
  // }

  const handleDeleteAuction = (auction, e) => {
    e.stopPropagation() // Prevent navigation to auction details
    setSelectedAuction(auction)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    // Here you would call your API to delete the auction
    toast({
      title: "Auction deleted",
      description: `${selectedAuction.productName} auction has been deleted successfully.`,
    })
    setIsDeleteDialogOpen(false)
  }

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "active":
        return "bg-success/10 text-success"
      case "ended":
        return "bg-muted"
      case "cancelled":
        return "bg-destructive/10 text-destructive"
      default:
        return "bg-muted"
    }
  }

  const getApprovalBadgeClass = (approval) => {
    switch (approval) {
      case "approved":
        return "bg-success/10 text-success"
      case "pending":
        return "bg-warning/10 text-warning"
      case "rejected":
        return "bg-destructive/10 text-destructive"
      default:
        return "bg-muted"
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <div className="container p-6">
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Auctions</h2>
        <p className="text-sm sm:text-base text-muted-foreground">Manage your upcoming and active auctions</p>
      </div>

      <FilterBar
        placeholder="Search auctions..."
        filters={statusFilters}
        approvalFilters={approvalFilters}
        onSearch={handleSearch}
        onFilterChange={handleStatusFilterChange}
        onApprovalFilterChange={handleApprovalFilterChange}
      />
    <div className="rounded-xl border bg-card p-4 md:p-6">
      {/* Header */}
      <div className=" flex sm:flex-row items-center justify-end mb-2">
        <CreateAuctionDialog />
      </div>

      {/* Responsive Table Container */}
      <div className="w-full overflow-x-auto sm:overflow-visible">
        <Table className="min-w-[600px] w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="text-sm">Item</TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("condition")}>
                Condition
              </TableHead>
              <TableHead className="cursor-pointer text-sm" onClick={() => handleSort("status")}>
                Status
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("adminApproval")}>
                Approval
              </TableHead>  
              <TableHead className="cursor-pointer text-right text-sm" onClick={() => handleSort("currentBid")}>
                Current Bid
              </TableHead>
              <TableHead className="cursor-pointer text-right text-sm" onClick={() => handleSort("bids")}>
                Bids
              </TableHead>
              <TableHead className="cursor-pointer text-right text-sm" onClick={() => handleSort("endDate")}>
                End Date
              </TableHead>
              <TableHead className="text-right text-sm">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredAuctions.map((auction) => (
              <TableRow 
                key={auction.id}
                onClick={() => handleAuctionClick(auction)}
              >
                <TableCell>
                  <div className="flex items-center gap-2 sm:gap-4">
                    <Image
                      src={auction.image || "/placeholder.svg"}
                      alt={auction.name}
                      width={40}
                      height={40}
                      className="rounded-lg object-cover"
                    />
                    <span className="font-medium text-sm sm:text-base">{auction.productName}</span>
                  </div>
                </TableCell>
                <TableCell>
                <div
                    className="text-right text-sm sm:text-base"
                  >
                    {auction.condition}
                  </div>
                </TableCell>
                <TableCell>
                  <div
                    className={cn(
                      "inline-flex items-center rounded-full px-2 py-0.5 text-xs sm:text-sm font-medium",
                      auction.status === "Active" && "bg-success/10 text-success",
                      auction.status === "Cancelled" && "bg-warning/10 text-warning",
                      auction.status === "ended" && "bg-muted",
                    )}
                  >
                    {auction.status}
                  </div>
                </TableCell>
                <TableCell>
                  <div
                    className={cn(
                      "inline-flex items-center rounded-full px-2 py-0.5 text-xs sm:text-sm font-medium",
                      auction.adminApproval === "approved" && "bg-success/10 text-success",
                      auction.adminApproval === "rejected" && "bg-warning/10 text-warning",
                      auction.adminApproval === "pending" && "bg-primary/10 text-primary"
                    )}
                  >
                    {auction.adminApproval}
                  </div>
                </TableCell>
                <TableCell className="text-right text-sm sm:text-base">
                  {auction.currentBid > 0 ? `$${auction.currentBid.toFixed(2)}` : "No bids"}
                </TableCell>
                <TableCell className="text-right text-sm sm:text-base">{auction.bids}</TableCell>
                <TableCell className="text-right text-sm sm:text-base">
                  {new Date(auction.endDate).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={(e) => {
                          e.stopPropagation()
                          setAuctionToEdit(auction)
                          setIsEditAuctionOpen(true)
                        }}
                        disabled={auction.adminApproval === "approved"}
                        className={auction.adminApproval === "approved" ? "opacity-50 cursor-not-allowed" : ""}
                        >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Auction
                      </DropdownMenuItem>
                      <DropdownMenuItem   
                        className="text-destructive"
                        onClick={(e) => handleDeleteAuction(auction, e )}
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        Cancel Auction
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
      </div>

          {/* Delete Confirmation Dialog */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to cancel this auction?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently cancel the auction for "{selectedAuction?.productName}
              " and notify any bidders.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {/* Edit Auction Form Dialog */}
      {auctionToEdit && (
        <EditAuctionForm open={isEditAuctionOpen} onOpenChange={setIsEditAuctionOpen} auction={auctionToEdit} />
      )}
      

  </div>
  </div>
    );}

