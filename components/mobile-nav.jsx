"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  Menu,
  Search,
  Home,
  Gavel,
  Grid3X3,
  Heart,
  ShoppingCart,
  Info,
  Mail,
  ChevronRight,
  TrendingUp,
  Clock,
  Star,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { cn } from "@/libs/utils"

export function MobileNav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const categories = [
    { name: "Art & Collectibles", href: "/categories/art", icon: Star },
    { name: "Electronics", href: "/categories/electronics", icon: Star },
    { name: "Fashion", href: "/categories/fashion", icon: Star },
    { name: "Home & Garden", href: "/categories/home", icon: Star },
    { name: "Jewelry & Watches", href: "/categories/jewelry", icon: Star },
    { name: "Vintage & Antiques", href: "/categories/vintage", icon: Star },
  ]

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex flex-col p-0">
        <div className="border-b p-4">
          <Link href="/" className="flex items-center space-x-2" onClick={() => setOpen(false)}>
            <div className="h-8 w-8 rounded-full gradient-bg flex items-center justify-center">
              <span className="text-primary-foreground font-bold">A</span>
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent gradient-bg">AuctionHub</span>
          </Link>
        </div>

        <div className="flex-1 overflow-auto">
          <nav className="flex flex-col px-2 py-4">
            <Link
              href="/"
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-base font-medium transition-colors",
                pathname === "/" ? "bg-primary/10 text-primary" : "hover:bg-muted hover:text-primary",
              )}
              onClick={() => setOpen(false)}
            >
              <Home className="h-5 w-5" />
              Home
            </Link>
            <Link
              href="/"
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-base font-medium transition-colors",
                pathname.startsWith ("/products") ? "bg-primary/10 text-primary" : "hover:bg-muted hover:text-primary",
              )}
              onClick={() => setOpen(false)}
            >
              <Home className="h-5 w-5" />
              Products
            </Link>

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="auctions" className="border-none">
                <AccordionTrigger
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-base font-medium transition-colors hover:bg-muted hover:text-primary hover:no-underline",
                    pathname.startsWith("/auctions") && "bg-primary/10 text-primary",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Gavel className="h-5 w-5" />
                    <span>Auctions</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-0 pt-1">
                  <div className="flex flex-col space-y-1 pl-10">
                    <Link
                      href="/auctions"
                      className="rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-primary transition-colors"
                      onClick={() => setOpen(false)}
                    >
                      All Auctions
                    </Link>
                    <Link
                      href="/auctions/ending-soon"
                      className="rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-primary transition-colors"
                      onClick={() => setOpen(false)}
                    >
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>Ending Soon</span>
                      </div>
                    </Link>
                    <Link
                      href="/auctions/trending"
                      className="rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-primary transition-colors"
                      onClick={() => setOpen(false)}
                    >
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4" />
                        <span>Trending</span>
                      </div>
                    </Link>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="categories" className="border-none">
                <AccordionTrigger
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-base font-medium transition-colors hover:bg-muted hover:text-primary hover:no-underline",
                    pathname.startsWith("/categories") && "bg-primary/10 text-primary",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Grid3X3 className="h-5 w-5" />
                    <span>Categories</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-0 pt-1">
                  <div className="flex flex-col space-y-1 pl-10">
                    {categories.map((category) => (
                      <Link
                        key={category.name}
                        href={category.href}
                        className="rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-primary transition-colors"
                        onClick={() => setOpen(false)}
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <Link
              href="/cart"
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-base font-medium transition-colors",
                pathname === "/cart" ? "bg-primary/10 text-primary" : "hover:bg-muted hover:text-primary",
              )}
              onClick={() => setOpen(false)}
            >
              <ShoppingCart className="h-5 w-5" />
              Cart
            </Link>

            <div className="my-2 border-t"></div>

            <Link
              href="/about"
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-base font-medium transition-colors",
                pathname === "/about" ? "bg-primary/10 text-primary" : "hover:bg-muted hover:text-primary",
              )}
              onClick={() => setOpen(false)}
            >
              <Info className="h-5 w-5" />
              About
            </Link>

            <Link
              href="/contact"
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-base font-medium transition-colors",
                pathname === "/contact" ? "bg-primary/10 text-primary" : "hover:bg-muted hover:text-primary",
              )}
              onClick={() => setOpen(false)}
            >
              <Mail className="h-5 w-5" />
              Contact
            </Link>
          </nav>
        </div>

        <div className="border-t p-4">
          <Link
            href="/dashboard"
            className="flex items-center justify-between rounded-lg bg-muted px-4 py-2 text-sm font-medium transition-colors hover:bg-muted/70"
            onClick={() => setOpen(false)}
          >
            <span>Seller Dashboard</span>
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  )
}

