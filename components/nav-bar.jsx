
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { NotificationPopover } from "@/components/notification-popover"
import { UserNav } from "@/components/user-nav"
import { MobileNav } from "@/components/mobile-nav"
import { SignInDialog } from "./sign-in-dialogue"
import { SignUpDialog } from "./sign-up-dialogue"
import { ThemeToggle } from "@/components/theme-toggle"
import { ShoppingCart, Gavel, Heart, TrendingUp, ChevronDown } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/libs/utils"

export function NavBar() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [searchFocused, setSearchFocused] = useState(false)
  const [categories, setCategories] = useState([])
  const [isSignedIn, setIsSignedIn] = useState(true); // State to track authentication status
  const [signInOpen, setSignInOpen] = useState(false); // State to control SignInDialog visibility
  const [signUpOpen, setSignUpOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])
  // Check session on component mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch("/api/auth/session");
        if (!response.ok) throw new Error("Failed to fetch session");

        const data = await response.json();
        setIsSignedIn(data.isSignedIn); // Update isSignedIn state
      } catch (error) {
        console.error("Error checking session:", error.message);
      }
    };
    checkSession();
  }, []);

  useEffect(() => {
      const fetchCategories = async () => {
        try {
          const response = await fetch("/api/categories"); // Adjust the endpoint if necessary
          if (!response.ok) throw new Error("Failed to fetch categories");
          
          const data = await response.json();
          setCategories(data);
        } catch (error) {
          console.error("Error fetching categories:", error.message);
        } 
      };
      fetchCategories();
    }, []);

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-300 pt-4",
        scrolled ? "border-b bg-background/95 backdrop-blur-lg shadow-sm" : "bg-transparent backdrop-blur-sm",
      )}
    >
      <div className="container flex h-10 items-center px-4 pb-4">
        {/* Left section - Logo and mobile menu */}
        <div className="flex items-center">
          <MobileNav />
          <Link href="/" className="flex items-center space-x-2 group">
            <span className="text-xl font-bold bg-clip-text">AuctionHub</span>
          </Link>
        </div>

        {/* Center section - Main navigation */}
        <div className="hidden lg:flex flex-1 items-center justify-center">
          <nav className="flex items-center space-x-1 text-sm font-medium justify-between">
            <Link
              href="/"
              className={cn(
                "px-3 py-2 rounded-md transition-colors hover:bg-primary/10 hover:text-primary",
                pathname === "/" && "text-primary font-semibold",
              )}
            >
              Home
            </Link>
            <Link
              href="/products"
              className={cn(
                "px-3 py-2 rounded-md transition-colors hover:bg-primary/10 hover:text-primary",
                pathname.startsWith("/products") && "text-primary font-semibold",
              )}
            >
              Products
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn(
                    "px-3 py-2 h-auto flex items-center gap-1 rounded-md transition-colors hover:bg-primary/10 hover:text-primary",
                    pathname.startsWith("/auctions") && "text-primary font-semibold",
                  )}
                >
                  Auctions
                  <ChevronDown className="h-4 w-4 opacity-70" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[220px] p-2">
                <DropdownMenuItem asChild>
                  <Link href="/auctions/allAuctions" className="flex items-center gap-2 cursor-pointer">
                    <Gavel className="h-4 w-4" />
                    <span>All Auctions</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/auctions/ending-soon" className="flex items-center gap-2 cursor-pointer">
                    <TrendingUp className="h-4 w-4" />
                    <span>Ending Soon</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn(
                    "px-3 py-2 h-auto flex items-center gap-1 rounded-md transition-colors hover:bg-primary/10 hover:text-primary",
                    pathname.startsWith("/categories") && "text-primary font-semibold",
                  )}
                >
                  Categories
                  <ChevronDown className="h-4 w-4 opacity-70" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[220px] p-2">
                {categories.map((category) => (
                  <DropdownMenuItem key={category._id} asChild>
                    <Link href={`/categories/${category.name}`} className="cursor-pointer">
                      {category.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Link
              href="/about"
              className={cn(
                "px-3 py-2 rounded-md transition-colors hover:bg-primary/10 hover:text-primary",
                pathname === "/about" && "text-primary font-semibold",
              )}
            >
              About
            </Link>

            <Link
              href="/contact"
              className={cn(
                "px-3 py-2 rounded-md transition-colors hover:bg-primary/10 hover:text-primary",
                pathname === "/contact" && "text-primary font-semibold",
              )}
            >
              Contact
            </Link>
          </nav>
        </div>

        {/* Right section - User actions */}
        <div className="fixed right-0 flex items-center gap-2 pr-4">

          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-primary/10 hover:text-primary transition-colors"
            asChild
          >
            <Link href="/cart">
              <ShoppingCart className="h-5 w-5" />
              <span className="sr-only">Cart</span>
            </Link>
          </Button>

          <NotificationPopover />
          <ThemeToggle />

          {/* Conditional rendering based on authentication status */}
          {isSignedIn ? (
            <div className="sm:block">
              <UserNav />
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => setSignInOpen(true)}>
                Sign In
              </Button>
              <Button onClick={() => setSignUpOpen(true)}>Sign Up</Button>
            </div>
          )}
          </div>
        </div>
        
          {/* SignIn Dialog */}
      <SignInDialog
        open={signInOpen}
        onOpenChange={setSignInOpen}
        onSignUp={() => {
          setSignInOpen(false);
          setSignUpOpen(true);
        }}
      />

      {/* SignUp Dialog */}
      <SignUpDialog
        open={signUpOpen}
        onOpenChange={setSignUpOpen}
        onSignIn={() => {
          setSignUpOpen(false);
          setSignInOpen(true);
        }}
      />

    </header>
  )
}

