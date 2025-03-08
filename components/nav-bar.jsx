// "use client";

// import { useState, useEffect } from "react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import {
//   Menu,
//   ShoppingCart,
//   Package,
//   Heart,
//   LayoutDashboard,
//   Users,
//   Settings,
//   LogOut,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
// import { useCart } from "./cart-provider";
// import { SignInDialog } from "./sign-in-dialogue";
// import { SignUpDialog } from "./sign-up-dialogue";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { NotificationPopover } from "@/components/notification-popover"
// import { ThemeToggle } from "@/components/theme-toggle"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";

// export function NavBar() {
//   const [showSignIn, setShowSignIn] = useState(false);
//   const [showSignUp, setShowSignUp] = useState(false);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [user, setUser] = useState(null);
//   const [isScrolled, setIsScrolled] = useState(false);
//   const router = useRouter();
//   const { cartCount } = useCart();

//   useEffect(() => {
//     // Simulate authentication (replace with real auth logic)
//     const checkAuth = async () => {
//       setIsAuthenticated(true);
//       setUser({
//         name: "John Doe",
//         email: "john@example.com",
//         image: "/placeholder.svg",
//         role: "merchant",
//       });
//     };
//     checkAuth();
//   }, []);

//   useEffect(() => {
//     const handleScroll = () => {
//       setIsScrolled(window.scrollY > 50);
//     };

//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   return (
//     <header
//       className={`fixed top-0 z-50 w-full border-b bg-background/95 backdrop-blur ${
//         isScrolled ? "shadow-md" : ""
//       } transition-all`}
//     >
//       <div className="py-4 px-[20px]">
//         <div className="flex items-center justify-between">
//           {/* Left Section: Mobile Menu and Logo */}
//           <div className="flex items-center gap-4">
//             <Sheet>
//               <SheetTrigger asChild>
//                 <Button variant="ghost" size="icon" className="md:hidden">
//                   <Menu className="h-5 w-5" />
//                   <span className="sr-only">Toggle menu</span>
//                 </Button>
//               </SheetTrigger>
//               <SheetContent side="left" className="w-[300px]">
//                 <nav className="flex flex-col gap-4">
//                   <Link href="/" className="text-lg font-bold">
//                     QuickCart
//                   </Link>
//                   <Link href="/products" className="text-sm">
//                     Products
//                   </Link>
//                   <Link href="/auctions" className="text-sm">
//                     Auctions
//                   </Link>
//                   <Link href="/categories" className="text-sm">
//                     Categories
//                   </Link>
//                   <Link href="/about" className="text-sm">
//                     About
//                   </Link>
//                   <Link href="/contact" className="text-sm">
//                     Contact
//                   </Link>
//                 </nav>
//               </SheetContent>
//             </Sheet>
//             <Link href="/" className="text-xl font-bold">
//               QuickCart
//             </Link>
//           </div>

//           {/* Center Section: Navigation Links */}
//           <nav className="hidden md:flex items-center gap-6">
//             <Link href="/products" className="text-sm font-medium hover:underline">
//               Products
//             </Link>
//             <Link href="/auctions" className="text-sm font-medium hover:underline">
//               Auctions
//             </Link>
//             <Link href="/categories" className="text-sm font-medium hover:underline">
//               Categories
//             </Link>
//             <Link href="/about" className="text-sm font-medium hover:underline">
//               About
//             </Link>
//             <Link href="/contact" className="text-sm font-medium hover:underline">
//               Contact
//             </Link>
//           </nav>

//           {/* Right Section: Cart & Authentication */}
//           <div className="flex items-center gap-2">
//             {/* Cart Button */}
//             <Link href="/cart">
//               <Button variant="ghost" size="icon" className="relative">
//                 <ShoppingCart className="h-5 w-5" />
//                 {cartCount > 0 && (
//                   <span className="absolute -right-1 -top-1 h-4 w-4 rounded-full bg-primary text-xs text-primary-foreground flex items-center justify-center">
//                     {cartCount}
//                   </span>
//                 )}
//               </Button>
//             </Link>
//             <NotificationPopover />
//             <ThemeToggle />

//             {/* Authentication Section */}
//             <div className="flex items-center space-x-4 relative">
//               {isAuthenticated && user ? (
//                 <DropdownMenu>
//                   <DropdownMenuTrigger asChild>
//                     <Button variant="ghost" className="relative h-8 w-8 rounded-full">
//                       <Avatar className="h-8 w-8">
//                         <AvatarImage src={user.image} alt={user.name} />
//                         <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
//                       </Avatar>
//                     </Button>
//                   </DropdownMenuTrigger>
//                   <DropdownMenuContent
//                     className="w-56"
//                     align="end"
//                     forceMount
//                     style={{ top: isScrolled ? "50px" : "auto" }}
//                   >
//                     <div className="flex items-center justify-start gap-2 p-2">
//                       <div className="flex flex-col space-y-1 leading-none">
//                         <p className="font-medium">{user.name}</p>
//                         <p className="text-sm text-muted-foreground">{user.email}</p>
//                       </div>
//                     </div>
//                     <DropdownMenuSeparator />
//                     <DropdownMenuItem>
//                       <Package className="mr-2 h-4 w-4" />
//                       <span>Orders</span>
//                     </DropdownMenuItem>
//                     <Link href= "/wishlist" >
//                       <DropdownMenuItem>
//                           <Heart className="mr-2 h-4 w-4" />
//                           <span>Wishlist</span> 
//                       </DropdownMenuItem>
//                     </Link>
//                     {user.role === "merchant" && (
//                       <>
//                       <Link href="/dashboard">
//                         <DropdownMenuItem>
//                           <LayoutDashboard className="mr-2 h-4 w-4" />
//                           <span>Dashboard</span>
//                         </DropdownMenuItem>
//                         </Link>
//                       </>
//                     )}
//                     <DropdownMenuSeparator />
//                     <DropdownMenuItem>
//                       <Settings className="mr-2 h-4 w-4" />
//                       <span>Settings</span>
//                     </DropdownMenuItem>
//                     <DropdownMenuItem>
//                       <LogOut className="mr-2 h-4 w-4" />
//                       <span>Log out</span>
//                     </DropdownMenuItem>
//                   </DropdownMenuContent>
//                 </DropdownMenu>
//               ) : (
//                 <>
//                   <Button variant="ghost" onClick={() => setShowSignIn(true)}>
//                     Log in
//                   </Button>
//                   <Button onClick={() => setShowSignUp(true)}>Sign up</Button>
//                 </>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Authentication Dialogs */}
//       <SignInDialog open={showSignIn} onOpenChange={setShowSignIn} />
//       <SignUpDialog open={showSignUp} onOpenChange={setShowSignUp} />
//     </header>
//   );
// }
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { NotificationPopover } from "@/components/notification-popover"
import { UserNav } from "@/components/user-nav"
import { MobileNav } from "@/components/mobile-nav"
import { ThemeToggle } from "@/components/theme-toggle"
import { ShoppingCart, Gavel, Heart, TrendingUp, ChevronDown } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/libs/utils"

export function NavBar() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [searchFocused, setSearchFocused] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const categories = [
    { name: "Art & Collectibles", href: "/categories/art" },
    { name: "Electronics", href: "/categories/electronics" },
    { name: "Fashion", href: "/categories/fashion" },
    { name: "Home & Garden", href: "/categories/home" },
    { name: "Jewelry & Watches", href: "/categories/jewelry" },
    { name: "Vintage & Antiques", href: "/categories/vintage" },
  ]

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
            {/* <div className="h-9 w-9 rounded-full gradient-bg flex items-center justify-center transition-transform group-hover:scale-110 duration-300">
              <span className="text-white font-bold text-lg">A</span>
            </div> */}
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
                  <Link href="/auctions" className="flex items-center gap-2 cursor-pointer">
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
                <DropdownMenuItem asChild>
                  <Link href="/auctions/featured" className="flex items-center gap-2 cursor-pointer">
                    <Heart className="h-4 w-4" />
                    <span>Featured Items</span>
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
                  <DropdownMenuItem key={category.name} asChild>
                    <Link href={category.href} className="cursor-pointer">
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

          <div className=" sm:block">
            <UserNav />
          </div>
        </div>
      </div>

      {/* Highlight bar - only on homepage */}
      {/*{pathname === "/" && (
        <div className="hidden md:flex items-center justify-center space-x-6 py-2 bg-muted/50 text-xs font-medium border-t border-b border-border/40">
          <div className="flex items-center">
            <span className="inline-block h-2 w-2 rounded-full bg-success mr-2"></span>
            Live Auctions
          </div>
          <div className="flex items-center">
            <span className="inline-block h-2 w-2 rounded-full bg-highlight mr-2"></span>
            Ending Soon
          </div>
          <div className="flex items-center">
            <span className="inline-block h-2 w-2 rounded-full bg-primary mr-2"></span>
            New Arrivals
          </div>
          <div className="flex items-center">
            <span className="inline-block h-2 w-2 rounded-full bg-destructive mr-2"></span>
            Hot Deals
          </div>
          <div className="flex items-center">
            <span className="inline-block h-2 w-2 rounded-full bg-secondary mr-2"></span>
            Featured Items
          </div>
        </div>
      )}*/}
    </header>
  )
}

