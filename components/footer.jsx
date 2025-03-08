// import Link from "next/link"
// import { FaFacebook, FaTwitter, FaLinkedin, FaYoutube, FaInstagram } from "react-icons/fa";
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"

// export function Footer() {
//   return (
//     <footer className="bg-gray-900 text-gray-100">
//       {/* Stats Section */}
//       <div className="container mx-auto px-6 py-8 border-b border-gray-800">
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
//           <div>
//             <h3 className="text-3xl font-bold text-primary">7,839,684+</h3>
//             <p className="text-sm text-gray-400">LEADS DRIVEN FOR CLIENTS</p>
//           </div>
//           <div>
//             <h3 className="text-3xl font-bold text-primary">$3,021,182,299+</h3>
//             <p className="text-sm text-gray-400">REVENUE DRIVEN FOR CLIENTS</p>
//           </div>
//           <div>
//             <h3 className="text-3xl font-bold text-primary">1.6 million</h3>
//             <p className="text-sm text-gray-400">HOURS OF EXPERTISE</p>
//           </div>
//           <div>
//             <h3 className="text-3xl font-bold text-primary">500+</h3>
//             <p className="text-sm text-gray-400">EXPERTS ON STAFF</p>
//           </div>
//         </div>
//       </div>

//       {/* CTA Section */}
//       <div className="container mx-auto px-6 py-8 border-b border-gray-800">
//         <div className="flex flex-col md:flex-row items-center justify-between gap-4">
//           <h3 className="text-xl font-semibold">Discover how we can help your business grow</h3>
//           <div className="flex gap-2">
//             <Input placeholder="Enter your website" className="bg-gray-800 border-gray-700" />
//             <Button>Send me a proposal!</Button>
//           </div>
//         </div>
//       </div>

//       {/* Links Section */}
//       <div className="container mx-auto px-6 py-12">
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
//           {/* Logo and Contact */}
//           <div className="lg:col-span-2">
//             <Link href="/" className="text-2xl font-bold mb-4 block">
//               YourLogo
//             </Link>
//             <p className="text-gray-400 mb-4">Ready to talk to a marketing expert? Give us a ring!</p>
//             <Button variant="outline" size="lg" className="w-full md:w-auto">
//               888-601-5359
//             </Button>
//           </div>

//           {/* Services */}
//           <div>
//             <h4 className="text-lg font-semibold mb-4">Services</h4>
//             <ul className="space-y-2">
//               <li>
//                 <Link href="#" className="text-gray-400 hover:text-primary">
//                   Digital Marketing
//                 </Link>
//               </li>
//               <li>
//                 <Link href="#" className="text-gray-400 hover:text-primary">
//                   SEO Services
//                 </Link>
//               </li>
//               <li>
//                 <Link href="#" className="text-gray-400 hover:text-primary">
//                   Web Design
//                 </Link>
//               </li>
//               <li>
//                 <Link href="#" className="text-gray-400 hover:text-primary">
//                   Social Media
//                 </Link>
//               </li>
//             </ul>
//           </div>

//           {/* Knowledge Base */}
//           <div>
//             <h4 className="text-lg font-semibold mb-4">Knowledge Base</h4>
//             <ul className="space-y-2">
//               <li>
//                 <Link href="#" className="text-gray-400 hover:text-primary">
//                   Digital Marketing
//                 </Link>
//               </li>
//               <li>
//                 <Link href="#" className="text-gray-400 hover:text-primary">
//                   Content Marketing
//                 </Link>
//               </li>
//               <li>
//                 <Link href="#" className="text-gray-400 hover:text-primary">
//                   Web Design
//                 </Link>
//               </li>
//               <li>
//                 <Link href="#" className="text-gray-400 hover:text-primary">
//                   SEO
//                 </Link>
//               </li>
//             </ul>
//           </div>

//           {/* Company */}
//           <div>
//             <h4 className="text-lg font-semibold mb-4">Company</h4>
//             <ul className="space-y-2">
//               <li>
//                 <Link href="#" className="text-gray-400 hover:text-primary">
//                   About Us
//                 </Link>
//               </li>
//               <li>
//                 <Link href="#" className="text-gray-400 hover:text-primary">
//                   Contact Us
//                 </Link>
//               </li>
//               <li>
//                 <Link href="#" className="text-gray-400 hover:text-primary">
//                   Careers
//                 </Link>
//               </li>
//               <li>
//                 <Link href="#" className="text-gray-400 hover:text-primary">
//                   Locations
//                 </Link>
//               </li>
//             </ul>
//           </div>

//           {/* Resources */}
//           <div>
//             <h4 className="text-lg font-semibold mb-4">Resources</h4>
//             <ul className="space-y-2">
//               <li>
//                 <Link href="#" className="text-gray-400 hover:text-primary">
//                   About Us
//                 </Link>
//               </li>
//               <li>
//                 <Link href="#" className="text-gray-400 hover:text-primary">
//                   Case Studies
//                 </Link>
//               </li>
//               <li>
//                 <Link href="#" className="text-gray-400 hover:text-primary">
//                   Tools
//                 </Link>
//               </li>
//               <li>
//                 <Link href="#" className="text-gray-400 hover:text-primary">
//                   Blog
//                 </Link>
//               </li>
//             </ul>
//           </div>
//         </div>

//         {/* Bottom Section */}
//         <div className="mt-12 pt-8 border-t border-gray-800">
//           <div className="flex flex-col md:flex-row justify-between items-center gap-4">
//             <div className="text-gray-400">© YourCompany 1995-2024. All Rights Reserved.</div>
//             <div className="flex space-x-4">
//               <Link href="#" className="text-gray-400 hover:text-primary">
//                 <FaFacebook className="h-5 w-5" />
//               </Link>
//               <Link href="#" className="text-gray-400 hover:text-primary">
//                 <FaTwitter className="h-5 w-5" />
//               </Link>
//               <Link href="#" className="text-gray-400 hover:text-primary">
//                 <FaLinkedin className="h-5 w-5" />
//               </Link>
//               <Link href="#" className="text-gray-400 hover:text-primary">
//                 <FaYoutube className="h-5 w-5" />
//               </Link>
//               <Link href="#" className="text-gray-400 hover:text-primary">
//                 <FaInstagram className="h-5 w-5" />
//               </Link>
//             </div>
//           </div>
//         </div>
//       </div>
//     </footer>
//   )
// }

import Link from "next/link"
import { Facebook, Instagram, Twitter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function Footer() {
  return (
    <footer className="grid md:grid-cols-1 pattern-bg">
      <div className="container px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="h-8 w-8 rounded-full gradient-bg flex items-center justify-center">
                <span className="text-primary-foreground font-bold">A</span>
              </div>
              <h3 className="text-lg font-semibold bg-clip-text text-transparent gradient-bg">AuctionHub</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              The premier online marketplace for unique items and collectibles.
            </p>
            <div className="mt-4 flex space-x-4">
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
            </div>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/auctions" className="text-muted-foreground hover:text-primary transition-colors">
                  Auctions
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-muted-foreground hover:text-primary transition-colors">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="text-muted-foreground hover:text-primary transition-colors">
                  How It Works
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold">Help & Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/faq" className="text-muted-foreground hover:text-primary transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold">Newsletter</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Subscribe to our newsletter for the latest auctions and updates.
            </p>
            <form className="flex space-x-2">
              <Input type="email" placeholder="Your email" className="h-9 border-primary/20" />
              <Button type="submit" className="h-9 gradient-bg border-0">
                Subscribe
              </Button>
            </form>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} AuctionHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

