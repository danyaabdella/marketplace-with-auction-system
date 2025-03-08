
"use client";

import { useState } from "react";
import { DashboardNav } from "components/dashboard/nav";
import { Overview } from "@/components/dashboard/overview";
import {MerchantProducts} from "components/dashboard/merchant-products";
import { MerchantAuctions } from "components/dashboard/merchant-auctions";
import {OrdersPage} from "components/dashboard/orders";
import {CustomersPage} from "components/dashboard/customers";
//import SettingsPage from "components/dashboard/setting";
// import HistoryPage from "path/to/HistoryPage"; // Adjust path as needed
import { Search } from "lucide-react";
import { Input } from "components/ui/input";

// Map of view names to their corresponding components
const viewComponents = {
  overview: Overview,
  products: MerchantProducts,
  auctions: MerchantAuctions,
  orders: OrdersPage,
  customers: CustomersPage,
  // history: HistoryPage,
  //settings: SettingsPage,
};

export default function DashboardPage() {
  const [currentView, setCurrentView] = useState("overview");

  // Get the component to render based on the current view
  const CurrentComponent = viewComponents[currentView];

  return (
    <div className="flex mt-4 min-h-screen">
      {/* Pass currentView and setCurrentView to DashboardNav */}
      <div>
        <DashboardNav currentView={currentView} setCurrentView={setCurrentView} />
      </div>
      
      <div className="flex-1">
        {/* <div className="border-b">
          <div className="flex h-16 items-center px-4">
            <div className="relative w-full flex-1 md:max-w-sm items-center">
              <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products..."
                className="w-full pl-8 border-primary/20 focus-visible:ring-primary"
              />
            </div>
          </div>
        </div> */}
        <div className={`flex-1 p-4 grid grid-cols-1 transition-all ${open ? "" : "blur-md"}`}>
            {/* Render the current component, or a fallback if invalid */}
            {CurrentComponent ? <CurrentComponent /> : <p>Invalid view selected</p>}
          
        </div>
      </div>
    </div>
  );
}