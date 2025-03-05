"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/libs/utils"
import { BarChart3, Box, Clock, Gavel, Home, Package, Settings, Users, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useState } from "react"

const navigation = [
  { name: "Overview", icon: BarChart3 },
  { name: "Products", icon: Package },
  { name: "Auctions", icon: Gavel },
  { name: "Orders", icon: Box },
  { name: "Customers", icon: Users },
  { name: "History", icon: Clock },
  //{ name: "Settings", icon: Settings },
];

export function DashboardNav({ currentView, setCurrentView }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const NavItems = () => (
    <>
      <div className="flex h-14 items-center px-4 border-b">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full gradient-bg flex items-center justify-center">
            <span className="text-primary-foreground font-bold">A</span>
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent gradient-bg">AuctionHub</span>
        </Link>
      </div>
      <div className="flex-1 space-y-1 p-2">
      {navigation.map((item) => {
          const viewName = item.name.toLowerCase();
          return (
            <button
              key={item.name}
              onClick={() => setCurrentView(viewName)}
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors w-full text-left",
                currentView === viewName
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-primary/10 hover:text-primary"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </button>
          );
        })}
        <Link
          href="/"
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-primary/10 hover:text-primary"
        >
          <Home className="h-4 w-4" />
          Back to Store
        </Link>
      </div>
    </>
  )

  return (
    <>
      {/* Mobile Navigation */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild className="lg:hidden absolute left-4 top-3 z-50">
          <Button variant="ghost" size="icon">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[240px] p-0">
          <NavItems />
        </SheetContent>
      </Sheet>

      {/* Desktop Navigation */}
      <div className="hidden lg:flex h-screen w-64 flex-col border-r bg-muted/30">
        <NavItems />
      </div>
    </>
  )
}

