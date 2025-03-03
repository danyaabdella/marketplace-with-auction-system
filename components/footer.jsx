import Link from "next/link"
import { FaFacebook, FaTwitter, FaLinkedin, FaYoutube, FaInstagram } from "react-icons/fa";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-100">
      {/* Stats Section */}
      <div className="container mx-auto px-6 py-8 border-b border-gray-800">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
          <div>
            <h3 className="text-3xl font-bold text-primary">7,839,684+</h3>
            <p className="text-sm text-gray-400">LEADS DRIVEN FOR CLIENTS</p>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-primary">$3,021,182,299+</h3>
            <p className="text-sm text-gray-400">REVENUE DRIVEN FOR CLIENTS</p>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-primary">1.6 million</h3>
            <p className="text-sm text-gray-400">HOURS OF EXPERTISE</p>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-primary">500+</h3>
            <p className="text-sm text-gray-400">EXPERTS ON STAFF</p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-6 py-8 border-b border-gray-800">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <h3 className="text-xl font-semibold">Discover how we can help your business grow</h3>
          <div className="flex gap-2">
            <Input placeholder="Enter your website" className="bg-gray-800 border-gray-700" />
            <Button>Send me a proposal!</Button>
          </div>
        </div>
      </div>

      {/* Links Section */}
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Logo and Contact */}
          <div className="lg:col-span-2">
            <Link href="/" className="text-2xl font-bold mb-4 block">
              YourLogo
            </Link>
            <p className="text-gray-400 mb-4">Ready to talk to a marketing expert? Give us a ring!</p>
            <Button variant="outline" size="lg" className="w-full md:w-auto">
              888-601-5359
            </Button>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Services</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-gray-400 hover:text-primary">
                  Digital Marketing
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-primary">
                  SEO Services
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-primary">
                  Web Design
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-primary">
                  Social Media
                </Link>
              </li>
            </ul>
          </div>

          {/* Knowledge Base */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Knowledge Base</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-gray-400 hover:text-primary">
                  Digital Marketing
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-primary">
                  Content Marketing
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-primary">
                  Web Design
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-primary">
                  SEO
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-gray-400 hover:text-primary">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-primary">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-primary">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-primary">
                  Locations
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-gray-400 hover:text-primary">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-primary">
                  Case Studies
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-primary">
                  Tools
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-primary">
                  Blog
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-400">© YourCompany 1995-2024. All Rights Reserved.</div>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-400 hover:text-primary">
                <FaFacebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-primary">
                <FaTwitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-primary">
                <FaLinkedin className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-primary">
                <FaYoutube className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-primary">
                <FaInstagram className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

// import { Facebook, Instagram, Twitter, Youtube } from "lucide-react"
// import { Input } from "@/components/ui/input"
// import { Button } from "@/components/ui/button"

// export function Footer() {
//   return (
//     <footer className="bg-gray-100">
//       <div className="container py-12 md:py-16">
//         <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
//           <div className="space-y-4">
//             <h3 className="text-lg font-bold">QuickCart</h3>
//             <p className="text-sm text-muted-foreground">
//               Your one-stop shop for all things tech. Quality products, great prices, and excellent service.
//             </p>
//             <div className="flex space-x-4">
//               <a href="#" className="text-muted-foreground hover:text-primary">
//                 <Facebook className="h-5 w-5" />
//               </a>
//               <a href="#" className="text-muted-foreground hover:text-primary">
//                 <Instagram className="h-5 w-5" />
//               </a>
//               <a href="#" className="text-muted-foreground hover:text-primary">
//                 <Twitter className="h-5 w-5" />
//               </a>
//               <a href="#" className="text-muted-foreground hover:text-primary">
//                 <Youtube className="h-5 w-5" />
//               </a>
//             </div>
//           </div>

//           <div>
//             <h3 className="font-semibold mb-4">Quick Links</h3>
//             <ul className="space-y-2">
//               <li>
//                 <a href="#" className="text-sm text-muted-foreground hover:text-primary">
//                   About Us
//                 </a>
//               </li>
//               <li>
//                 <a href="#" className="text-sm text-muted-foreground hover:text-primary">
//                   Contact Us
//                 </a>
//               </li>
//               <li>
//                 <a href="#" className="text-sm text-muted-foreground hover:text-primary">
//                   Terms & Conditions
//                 </a>
//               </li>
//               <li>
//                 <a href="#" className="text-sm text-muted-foreground hover:text-primary">
//                   Privacy Policy
//                 </a>
//               </li>
//             </ul>
//           </div>

//           <div>
//             <h3 className="font-semibold mb-4">Customer Service</h3>
//             <ul className="space-y-2">
//               <li>
//                 <a href="#" className="text-sm text-muted-foreground hover:text-primary">
//                   Shipping Information
//                 </a>
//               </li>
//               <li>
//                 <a href="#" className="text-sm text-muted-foreground hover:text-primary">
//                   Returns & Exchanges
//                 </a>
//               </li>
//               <li>
//                 <a href="#" className="text-sm text-muted-foreground hover:text-primary">
//                   FAQ
//                 </a>
//               </li>
//               <li>
//                 <a href="#" className="text-sm text-muted-foreground hover:text-primary">
//                   Track Order
//                 </a>
//               </li>
//             </ul>
//           </div>

//           <div>
//             <h3 className="font-semibold mb-4">Newsletter</h3>
//             <p className="text-sm text-muted-foreground mb-4">
//               Subscribe to our newsletter for the latest updates and exclusive offers.
//             </p>
//             <form className="space-y-2">
//               <Input type="email" placeholder="Enter your email" />
//               <Button type="submit" className="w-full">
//                 Subscribe
//               </Button>
//             </form>
//           </div>
//         </div>

//         <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
//           <p>&copy; {new Date().getFullYear()} QuickCart. All rights reserved.</p>
//         </div>
//       </div>
//     </footer>
//   )
// }

